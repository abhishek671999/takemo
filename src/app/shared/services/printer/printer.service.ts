import { Injectable } from '@angular/core';
import { PrintBuffer } from './buffer/print-buffer';
import { PrintBuilder } from './builders/printbuilder';
import { PrintDriver } from './driver/printDriver';
import { BehaviorSubject } from 'rxjs';
import { EscBuilder } from './builders/escbuilder';
import { WebPrintDriver } from './driver/WebPrintDriver';
import { WebPrintBuilder } from './builders/webPrintBuilder';


const ESC = 0x1b;
const GS = 0x1D;

@Injectable({
  providedIn: 'root'
})
export class PrinterService  extends PrintBuilder{
  public printLanguage?: string;
    public driver?: PrintDriver;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public builder? : PrintBuilder;

    constructor(){
        super()
    }

    setDriver(driver: PrintDriver, printLanguage: string = 'ESC/POS'): PrinterService{
        this.driver = driver;
        this.printLanguage = printLanguage;
        this.driver.connect()

        this.driver.isConnected.subscribe(result => {
            this.isConnected.next(result)
        })
        return this
    }
    

    init(): PrinterService{
        if(!this.driver){
            throw "Cannot inititate the print service. No connection detected!! "
        }
        switch(this.printLanguage){
            case "WebPrint":
              this.builder = new WebPrintBuilder()
              break
            case "StarPRNT":
                break
            default:
                this.builder = new EscBuilder()
        }
        this.builder?.init()
        return this
    }
    
    /**
   *
   * @param cutType full|partial
   */
  public cut(cutType: string = 'full'): PrinterService {
    this.builder?.cut(cutType);
    return this;
  }

  /**
   *
   * @param lineCount How many lines to feed
   */
  public feed(lineCount: number = 1): PrinterService {
    this.builder?.feed(lineCount);
    return this;
  }

  setInverse(value: boolean = true): PrinterService {
    this.builder?.setInverse(value);
    return this;

  }

  setBold(value: boolean = true): PrinterService {
    this.builder?.setBold(value);
    return this;

  }

  setUnderline(value: boolean = true): PrinterService {
    this.builder?.setUnderline(value);
    return this;

  }

  /**
   *
   * @param value left|center\right
   */
  setJustification(value: string = 'left'): PrinterService {
    this.builder?.setJustification(value);
    return this;
  }

  /**
   *
   * @param value normal|large
   */
  setSize(value: string = 'normal'): PrinterService {
    this.builder?.setSize(value);
    return this;
  }

  /**
   *
   * @param text
   */
  writeLine(text: string = ''): PrinterService {
    this.builder?.writeLine(text);
    return this;
  }

  /**
   * write the current builder value to the driver and clear out the builder
   */
  flush() {
    this.driver?.write(this.builder?.flush());
    console.log('Flushed')
  }

  writeCustomLine(printObj: any) {
    this.builder?.setBold(printObj.bold).setJustification(printObj.justification).setSize(printObj.size).setUnderline(printObj.underline).writeLine(printObj.text).setBold(false).setJustification('left').setSize('normal').setUnderline(false)
    return this
  }
}
