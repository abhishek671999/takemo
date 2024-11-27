import { Injectable } from '@angular/core';
import { UsbDriver } from './usbDriver';
import { PrinterService } from './printer.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintConnectorService {

  constructor(  public printService: PrinterService) {
    this.usbDriver.isConnected.subscribe(
      (data) => {
        this.usbSought = data
      }
    )
   }

  private usbDriver = new UsbDriver();


  public usbSought = false
  public printerConnected = this.usbDriver.isConnected

  async seekUSB() {
    await this.usbDriver.requestUsb().subscribe((data) => {
      this.printService.setDriver(this.usbDriver) 
    });
  }

}
