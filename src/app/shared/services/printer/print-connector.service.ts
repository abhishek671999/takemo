import { Injectable } from '@angular/core';
import { UsbDriver } from './driver/usbDriver';
import { PrinterService } from './printer.service';
import { WebPrintDriver } from './driver/WebPrintDriver';

@Injectable({
  providedIn: 'root',
})
export class PrintConnectorService {
  constructor(public printService: PrinterService) {}

  private usbDriver = new UsbDriver();

  private webConnection = new WebPrintDriver('localhost')
  public usbSought = false;
  public isWebConnected = false

  async seekUSB() {
    await this.usbDriver.requestUsb().subscribe((data) => {
      this.printService.setDriver(this.usbDriver);
      this.printService.isConnected.subscribe((result) => {
        this.usbSought = result;
      });
    });
  }

  seekConnection() {
    this.printService.setDriver(this.webConnection, 'WebPrint')
    this.printService.isConnected.subscribe(result => {
      this.usbSought = result
    })
  }
}
