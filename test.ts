/**
 * IR tests
 */

makerbit.connectInfrared(DigitalPin.P0);
makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, () => {});
makerbit.onIrButton(IrButton.Up, IrButtonAction.Released, () => {});
const wasPressed: boolean = makerbit.wasAnyIrButtonPressed();
const currentButton: number = makerbit.pressedIrButton();
const button: number = makerbit.irButton(IrButton.Number_9);
