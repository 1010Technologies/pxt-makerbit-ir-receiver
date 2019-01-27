/**
 * IR tests
 */

makerbit.connectInfrared(DigitalPin.P0);
makerbit.onIrButtonPressed(IrButton.Ok, () => {});
makerbit.onIrButtonReleased(IrButton.Up, () => {});
makerbit.isIrButtonPressed(IrButton.Number_0);
makerbit.onIrCommandReceived(() => {});
makerbit.onIrCommandExpired(() => {});
const command: number = makerbit.irCommandCode();
const button: number = makerbit.irButton(IrButton.Number_9);
