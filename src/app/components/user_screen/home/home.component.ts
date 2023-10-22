import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, Route, ActivatedRoute} from '@angular/router';
import { delay } from 'rxjs';
import { RestuarantService } from 'src/app/restuarant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private _router: Router,private _restuarantService: RestuarantService, private activatedRoute: ActivatedRoute) {}

  showSpinner = true
  public restaurantInfo
  ngOnInit(){
    setTimeout( () => {
    this._restuarantService.getResturantInfo().subscribe(
        data => this.restaurantInfo=data,
        error => console.log(error)
      )
      this.showSpinner = false
    }, 10)
  }
  
  onSelect(info){
    console.log(info.restaurant_id)
    this._router.navigate(['./home/menu', info.restaurant_id])
  }

  printpath(parent: string, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      console.log(parent + '/' + route.path);
      if (route.children) {
        const currentPath = route.path ? `${parent}/${route.path}` : parent;
        console.log('children')
        this.printpath(currentPath, route.children);
      }
    }
  }

}
