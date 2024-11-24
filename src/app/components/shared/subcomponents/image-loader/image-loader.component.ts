import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent {
  @Input() loader:string='https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif';
  @Input() height:number=100;
  @Input() width:number=100;
  @Input()
  image!: string;

  isLoading:boolean;
  
  constructor() { 
    this.isLoading=true;
  }

  hideLoader(){
    this.isLoading=false;
  }
}
