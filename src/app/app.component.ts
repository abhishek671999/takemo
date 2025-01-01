import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'takemo';
  
  constructor(private swUpdate: SwUpdate) {
  }
  
  ngOnInit() {

      if (this.swUpdate.isEnabled) {

          this.swUpdate.available.subscribe(() => {

              if(confirm("New version available. Load New Version?")) {

                  window.location.reload();
              }
          });
      }        
  }
  
}
