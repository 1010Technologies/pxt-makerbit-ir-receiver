# MakerBit IR Receiver

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit-ir-receiver.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit-ir-receiver)

MakeCode extension for Keyestudio Infrared Wireless Module Kit. The extension should also work with other with IR receivers and NEC compatible IR remotes.

## MakerBit Board

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R") |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                            _MakerBit_                                            |                                   _MakerBit+R with motor controller_                                   |

# Documentation

## makerbit.connectIrReceiver

Connects to the IR receiver module at the specified pin and configures the IR protocol.

```sig
makerbit.connectIrReceiver(DigitalPin.P0, IrProtocol.Keyestudio)
```

### Parameters

- `pin` - digital pin with an attached IR receiver
- `protocol` - the IR protocol to be detected, for example IrProtocol.Keyestudio or IrProtocol.NEC

## makerbit.onIrButton

Do something when a specific button is pressed or released on the remote control.

```sig
makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, () => {})
```

### Parameters

- `button` - the button to be checked
- `action`- the trigger action
- `handler` - body code to run when the event is raised

## makerbit.irButton

Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.

```sig
makerbit.irButton()
```

## makerbit.onIrDatagram

Do something when a specific button is pressed or released on the remote control.

```sig
makerbit.onIrDatagram(() => {})
```

### Parameters

- `handler` - body code to run when the event is raised

## makerbit.irDatagram

Returns the IR datagram as 32-bit hexadecimal string. The last received datagram is returned or "0x00000000" if no data has been received yet.

```sig
makerbit.irDatagram()
```

## makerbit.wasIrDataReceived

Returns true if any IR data was received since the last call of this function. False otherwise.

```sig
makerbit.wasIrDataReceived();
```

## makerbit.irButtonCode

Returns the command code of a specific IR button.

```sig
makerbit.irButtonCode(IrButton.Number_9)
```

### Parameters

- `button` - the button

## MakeCode Example

```blocks
makerbit.connectIrReceiver(DigitalPin.P0, IrProtocol.Keyestudio)

makerbit.onIrButton(IrButton.Ok, IrButtonAction.Released, function () {
    basic.showIcon(IconNames.SmallHeart)
})

makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, function () {
    basic.showIcon(IconNames.Heart)
})

basic.forever(function () {
    if (makerbit.wasAnyIrButtonPressed()) {
        basic.showNumber(makerbit.irButton())
    }
})

```

## License

Licensed under the MIT License (MIT). See LICENSE file for more details.

## Supported targets

- for PXT/microbit
- for PXT/calliope
