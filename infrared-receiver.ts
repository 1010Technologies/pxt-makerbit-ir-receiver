// MakerBit blocks supporting a Keyestudio Infrared Wireless Module Kit
// (receiver module+remote controller)

const enum IrButton {
  //% block="any"
  Any = -1,
  //% block="▲"
  Up = 0x62,
  //% block=" "
  Unused_2 = -2,
  //% block="◀"
  Left = 0x22,
  //% block="OK"
  Ok = 0x02,
  //% block="▶"
  Right = 0xc2,
  //% block=" "
  Unused_3 = -3,
  //% block="▼"
  Down = 0xa8,
  //% block=" "
  Unused_4 = -4,
  //% block="1"
  Number_1 = 0x68,
  //% block="2"
  Number_2 = 0x98,
  //% block="3"
  Number_3 = 0xb0,
  //% block="4"
  Number_4 = 0x30,
  //% block="5"
  Number_5 = 0x18,
  //% block="6"
  Number_6 = 0x7a,
  //% block="7"
  Number_7 = 0x10,
  //% block="8"
  Number_8 = 0x38,
  //% block="9"
  Number_9 = 0x5a,
  //% block="*"
  Star = 0x42,
  //% block="0"
  Number_0 = 0x4a,
  //% block="#"
  Hash = 0x52,
}

const enum IrButtonAction {
  //% block="pressed"
  Pressed = 0,
  //% block="released"
  Released = 1,
}

//% color=#0fbc11 icon="\u272a" block="MakerBit"
//% category="MakerBit"
namespace makerbit {
  let irState: IrState;

  const MICROBIT_MAKERBIT_IR_NEC = 777;
  const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789;
  const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790;
  const IR_REPEAT = 256;
  const IR_INCOMPLETE = 257;

  interface IrState {
    command: number;
    hasNewCommand: boolean;
    bitsReceived: uint8;
    commandBits: uint8;
  }

  function pushBit(bit: number): number {
    irState.bitsReceived += 1;
    if (irState.bitsReceived <= 16) {
      // ignore all address and inverse address bits
      return IR_INCOMPLETE;
    } else if (irState.bitsReceived < 24) {
      irState.commandBits = (irState.commandBits << 1) + bit;
      return IR_INCOMPLETE;
    } else if (irState.bitsReceived === 24) {
      irState.commandBits = (irState.commandBits << 1) + bit;
      return irState.commandBits & 0xff;
    } else {
      // ignore all inverse command bits
      return IR_INCOMPLETE;
    }
  }

  function detectCommand(markAndSpace: number): number {
    if (markAndSpace < 1600) {
      // low bit
      return pushBit(0);
    } else if (markAndSpace < 2700) {
      // high bit
      return pushBit(1);
    }

    irState.bitsReceived = 0;

    if (markAndSpace < 12500) {
      // Repeat detected
      return IR_REPEAT;
    } else if (markAndSpace < 14500) {
      // Start detected
      return IR_INCOMPLETE;
    } else {
      return IR_INCOMPLETE;
    }
  }

  function enableIrMarkSpaceDetection(pin: DigitalPin) {
    pins.setPull(pin, PinPullMode.PullNone);

    let mark = 0;
    let space = 0;

    pins.onPulsed(pin, PulseValue.Low, () => {
      // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
      mark = pins.pulseDuration();
    });

    pins.onPulsed(pin, PulseValue.High, () => {
      // LOW
      space = pins.pulseDuration();
      const command = detectCommand(mark + space);
      if (command !== IR_INCOMPLETE) {
        control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, command);
      }
    });
  }

  /**
   * Connects to the IR receiver module at the specified pin.
   * @param pin IR receiver pin, eg: DigitalPin.P0
   */
  //% subcategory="IR Receiver"
  //% blockId="makerbit_infrared_connect_receiver"
  //% block="connect IR receiver at %pin"
  //% pin.fieldEditor="gridpicker"
  //% pin.fieldOptions.columns=4
  //% pin.fieldOptions.tooltips="false"
  //% weight=90
  export function connectIrReceiver(pin: DigitalPin): void {
    if (irState) {
      return;
    }

    irState = {
      bitsReceived: 0,
      commandBits: 0,
      command: IrButton.Any,
      hasNewCommand: false,
    };

    enableIrMarkSpaceDetection(pin);

    let activeCommand = IR_INCOMPLETE;
    let repeatTimeout = 0;
    const REPEAT_TIMEOUT_MS = 120;

    control.onEvent(
      MICROBIT_MAKERBIT_IR_NEC,
      EventBusValue.MICROBIT_EVT_ANY,
      () => {
        const necValue = control.eventValue();

        // Refresh repeat timer
        if (necValue <= 255 || necValue === IR_REPEAT) {
          repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
        }

        // Process a new command
        if (necValue <= 255 && necValue !== activeCommand) {
          if (activeCommand >= 0) {
            control.raiseEvent(
              MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
              activeCommand
            );
          }

          irState.hasNewCommand = true;
          irState.command = necValue;
          activeCommand = necValue;
          control.raiseEvent(MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID, necValue);
        }
      }
    );

    control.inBackground(() => {
      while (true) {
        if (activeCommand === IR_INCOMPLETE) {
          // sleep to save CPU cylces
          basic.pause(2 * REPEAT_TIMEOUT_MS);
        } else {
          const now = input.runningTime();
          if (now > repeatTimeout) {
            // repeat timed out
            control.raiseEvent(
              MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
              activeCommand
            );
            activeCommand = IR_INCOMPLETE;
          } else {
            basic.pause(REPEAT_TIMEOUT_MS);
          }
        }
      }
    });
  }

  /**
   * Do something when a specific button is pressed or released on the remote control.
   * @param button the button to be checked
   * @param action the trigger action
   * @param handler body code to run when event is raised
   */
  //% subcategory="IR Receiver"
  //% blockId=makerbit_infrared_on_ir_button
  //% block="on IR button | %button | %action"
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=3
  //% button.fieldOptions.tooltips="false"
  //% weight=69
  export function onIrButton(
    button: IrButton,
    action: IrButtonAction,
    handler: () => void
  ) {
    control.onEvent(
      action === IrButtonAction.Pressed
        ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
        : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
      button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
      () => {
        irState.command = control.eventValue();
        handler();
      }
    );
  }

  /**
   * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
   */
  //% subcategory="IR Receiver"
  //% blockId=makerbit_infrared_ir_button_pressed
  //% block="IR button"
  //% weight=67
  export function irButton(): number {
    if (!irState) {
      return IrButton.Any;
    }
    return irState.command;
  }

  /**
   * Returns true if any button was pressed since the last call of this function. False otherwise.
   */
  //% subcategory="IR Receiver"
  //% blockId=makerbit_infrared_was_any_button_pressed
  //% block="any IR button was pressed"
  //% weight=57
  export function wasAnyIrButtonPressed(): boolean {
    if (!irState) {
      return false;
    }
    if (irState.hasNewCommand) {
      irState.hasNewCommand = false;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the command code of a specific IR button.
   * @param button the button
   */
  //% subcategory="IR Receiver"
  //% blockId=makerbit_infrared_button_code
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=3
  //% button.fieldOptions.tooltips="false"
  //% block="IR button code %button"
  //% weight=56
  export function irButtonCode(button: IrButton): number {
    return button as number;
  }
}
