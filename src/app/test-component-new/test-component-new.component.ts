import { Component } from '@angular/core';
import { PrinterService } from '../shared/services/printer/printer.service';
import { PrintConnectorService } from '../shared/services/printer/print-connector.service';
// import { ScratchWorkService } from '../scratch-work.service';


@Component({
  selector: 'app-test-component-new',
  templateUrl: './test-component-new.component.html',
  styleUrls: ['./test-component-new.component.css'] 
})
export class TestComponentNewComponent {

    constructor(private printConnector: PrintConnectorService){}

  ngOnInit() {
    debugger
    this.printConnector.seekConnection()
    console.log(this.printConnector.isWebConnected)
    }
}
