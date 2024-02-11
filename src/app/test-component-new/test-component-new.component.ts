import { Component } from '@angular/core';
// import { ScratchWorkService } from '../scratch-work.service';


@Component({
  selector: 'app-test-component-new',
  templateUrl: './test-component-new.component.html',
  styleUrls: ['./test-component-new.component.css'] 
})
export class TestComponentNewComponent {

  printRecipt(){
    window.print()
  }

}
