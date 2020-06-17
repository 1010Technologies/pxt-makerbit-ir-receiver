/**
 * IR tests
 */

makerbit.connectIrReceiver(DigitalPin.P0, IrProtocol.NEC);
makerbit.onIrButton(IrButton.Ok, IrButtonAction.Pressed, () => {});
makerbit.onIrButton(IrButton.Up, IrButtonAction.Released, () => {});
makerbit.onIrDatagram(() => {});
const received: boolean = makerbit.wasIrDataReceived();
const button: number = makerbit.irButton();
const datagram: string = makerbit.irDatagram();
const buttonCode: number = makerbit.irButtonCode(IrButton.Number_9);
