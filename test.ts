/**
 * IR tests
 */

makerbit.connectInfrared(DigitalPin.P0);
makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, () => {});
makerbit.onIrButton(IrButton.Up, IrButtonAction.Released, () => {});
const isPressed: boolean = makerbit.isIrButtonPressed(IrButton.Number_0);
const currentButton: number = makerbit.pressedIrButton();
const button: number = makerbit.irButton(IrButton.Number_9);
