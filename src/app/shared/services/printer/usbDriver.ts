import { BehaviorSubject, Observable } from 'rxjs';
import { PrintDriver } from './printDriver';
import { Injectable } from '@angular/core';

declare var navigator: any;

export class UsbDriver extends PrintDriver {
    private device?: any;
    private endPoint?: any;
    private vendorId?: number;
    private productId?: number;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(vendorId?: number, productId?: number){
        super()
        this.vendorId = vendorId
        this.productId = productId
    }

    public connect(){
        navigator.usb.getDevices().then((devices: any[]) => {
            this.device = devices.find( (device: any) => {
              return device.vendorId == this.vendorId && device.productId == this.productId
            })
            console.log('connected', this.device)
            return this.device?.open()
          }).then(() => {
            console.log('Open success')
            let result = this.device?.selectConfiguration(1)
            console.log('Configuration', result, this.device)
            return result
          })
          .then(() => {
            let result = this.device?.claimInterface(0)
            return result
          }).then( (result: any) => {
            console.log('This is error result: ', result)
            const endPoints: any[] | undefined = this.device?.configuration?.interfaces[0].alternate.endpoints;
            if(endPoints){
              this.endPoint = endPoints.find((endPoint: any) => endPoint.direction === 'out');
              this.isConnected.next(true)
              this.listenForUsbConnections()
            }
          }).catch((result: any) => {
            console.log('In catch block: ', result)
            this.isConnected.next(false)
          })
    }

    requestUsb(): Observable<any>{
        console.log('Requesting USB')
        return new Observable(observer => {
          navigator.usb.requestDevice({filters: []})
            .then((result: any) => {
                
              this.vendorId = result.vendorId;
              this.productId = result.productId
              console.log('vendor id and product id: ', this.vendorId, this.productId)
              return observer.next(result)
            }).catch((error: any) => {
                console.log('Error occured whilte connecting to usb: ', error)
              return observer.error(error)
            })
        })
      }

      private listenForUsbConnections(): void {
        navigator.usb.addEventListener('disconnect', () => {
            this.isConnected.next(false)
        });
        navigator.usb.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }

    public async write(data: Uint8Array): Promise<void>{
        console.log('IN write: ', this.endPoint, this.isConnected)
        if(this.endPoint){
          this.device?.transferOut(this.endPoint.endpointNumber, data)
        }else{
          console.log('Transfer failed:: ')
        }
      }
}