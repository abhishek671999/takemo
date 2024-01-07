import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css']
})
export class PointOfSaleComponent {
  constructor(private menuService: MenuService, private router: Router){}
  public menu;
  public summary = {
    amount: 0,
    itemList: []
  }


  ngOnInit(){
    this.menuService.getMenu(sessionStorage.getItem('restaurant_id')).subscribe(
      data => {
        this.menu = data['menu'];
        this.menu.map((category) => {
          category.category.items.filter(
            (element) => element.is_available == true
          );
        });
        this.setQuantity();
        this.showOnlyFirstCategory()
        console.log('THis is menu: ', this.menu)
      }
    )
  }


  setQuantity() {
    
    console.log('Setting quantity:', this.menu);
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
      });
    });

  }

  showOnlyFirstCategory(){
    setTimeout(() => {
      console.log('trying to show only first element')
    let allCategoryBlock = Array.from(document.getElementsByClassName('category-wrapper') as HTMLCollectionOf<HTMLElement>)
    allCategoryBlock.forEach( (ele, index) => {
      if(index == 0){
        ele.classList.add('show')
        ele.classList.remove('hidden')
      }else{
        ele.classList.remove('show')
        ele.classList.add('hidden')
      }
    }
    )

    let allCategoryBar = Array.from(document.getElementsByClassName('category-bar-items') as HTMLCollectionOf<HTMLElement>)
    allCategoryBar.forEach( (ele, index) => {
      if(index == 0){
        ele.classList.add('active')
      }else{
        ele.classList.remove('active')
      }
    })
    }, 10);
      
  }

  categoryClickEventHandler(category){
    category = category.replace(' ', '')
    console.log(category)
    let allCategoryBlock = Array.from(document.getElementsByClassName('category-wrapper')  as HTMLCollectionOf<HTMLElement>)
    console.log(allCategoryBlock)
    allCategoryBlock.forEach(element => {
      element.classList.remove('show')
      element.classList.add('hidden')
    });
    let categoryBlock = document.getElementById(category)
    categoryBlock.classList.add('show')
    categoryBlock.classList.remove('hidden')

    let allCategoryBar = Array.from(document.getElementsByClassName('category-bar-items') as HTMLCollectionOf<HTMLElement>)
    allCategoryBar.forEach( ele => {
      console.log('Cateogry contains', ele.classList.contains(category))
      if(ele.classList.contains(category)){
        ele.classList.add('active')
      }else{
        ele.classList.remove('active')
      }
    })
  }
  
  subItem(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.summary.amount -= item.price;
    }
    if(item.quantity == 0){
      this.summary.itemList = this.summary.itemList.filter( x => x.id != item.id)
    }
  }

  addItem(item) {
    console.log(item)
    let itemAdded = this.summary.itemList.find( x => x.id == item.id)
    if(!itemAdded){
      this.summary.itemList.push(item)
    }
    if (item.quantity < 10) {
      item.quantity += 1;
      this.summary.amount += item.price;
    }
  }

  clearSummary(){
    this.summary.amount = 0
    this.summary.itemList.forEach( item => {
      item.quantity = 0
    })
    this.summary.itemList = []
  }

  placeOrder(){
    console.log('Place order api would be called here.')
  }


  navigateToEditMenu(){
    this.router.navigate([`/owner/edit-menu/${sessionStorage.getItem('restaurant_id')}`])
  }

  navigateToPendingOrders(){
    this.router.navigate(['/owner/pending-orders'])
  }
}
