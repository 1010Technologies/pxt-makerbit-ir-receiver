/**
 * IR tests
 */

makerbit.connectIrReceiver(DigitalPin.P0, IrProtocol.NEC);
makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, () => {});
makerbit.onIrButton(IrButton.Up, IrButtonAction.Released, () => {});
const wasPressed: boolean = makerbit.wasAnyIrButtonPressed();
const currentButton: number = makerbit.irButton();
const button: number = makerbit.irButtonCode(IrButton.Number_9);
