import { Injectable } from '@angular/core';
import { UsbDriver } from './usbDriver';
import { PrinterService } from './printer.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintConnectorService {

  constructor(  public printService: PrinterService) { }

  private usbDriver = new UsbDriver();


  public usbSought = false
  public printerConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  async seekUSB() {
    await this.usbDriver.requestUsb().subscribe((data) => {
      console.log('my data', data);
      this.printService.setDriver(this.usbDriver);
      this.printService.isConnected.subscribe(result => {
        console.log('usb observer', result)
        this.usbSought = result
        this.printerConnected.next(result)
      }
    )
    });
  }

}
