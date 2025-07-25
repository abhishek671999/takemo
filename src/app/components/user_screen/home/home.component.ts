import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, Route, ActivatedRoute} from '@angular/router';
import { delay } from 'rxjs';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private _router: Router,
    private _RestaurantService: RestaurantService,
    private activatedRoute: ActivatedRoute
  ) {}

  showSpinner = true;
  public restaurantInfo;
  ngOnInit() {
    setTimeout(() => {
      this._RestaurantService.getResturantInfo().subscribe(
        (data) => (this.restaurantInfo = data),
        (error) => console.log(error)
      );
      this.showSpinner = false;
    }, 10);
  }

  onSelect(info) {
    sessionStorage.setItem('restaurant_id', info.restaurant_id);
    sessionStorage.setItem('table_management', info.table_management);
    this._router.navigate(['./user/menu', info.restaurant_id]);
  }

  printpath(parent: string, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      console.log(parent + '/' + route.path);
      if (route.children) {
        const currentPath = route.path ? `${parent}/${route.path}` : parent;
        console.log('children');
        this.printpath(currentPath, route.children);
      }
    }
  }
}
