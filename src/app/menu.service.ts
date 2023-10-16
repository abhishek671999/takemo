import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  host:string = '"http://65.20.75.191:8001"';
  _submit_url = this.host + '/api/v1/inventory/create_order/'
  headers:any;
  constructor(private _http: HttpClient) { }

  response = {
    bangalore: [
      { categoryname: 'category1',
        categoryinfo: [
          { name: 'item1', price: 100, isAvailable: true},
          { name: 'item2', price: 200, isAvailable: true} 
        ]
      },
      {
          categoryname: 'category2',
          categoryinfo: [
          { name: 'item3', price: 300, isAvailable: true},
          { name: 'item4', price: 400, isAvailable: true}
        ]
      }
    ]
  }
  response1 = {
    "menu": [
        {
            "category": {
                "id": 1,
                "name": "Breakfast",
                "items": [
                    {
                        "id": 1,
                        "name": "Masala Dose",
                        "price": 60,
                        "is_available": true
                    },
                    {
                        "id": 2,
                        "name": "Idli",
                        "price": 40,
                        "is_available": true
                    }
                ]
            }
        },
        {
            "category": {
                "id": 3,
                "name": "Juice",
                "items": [
                    {
                        "id": 5,
                        "name": "Mango",
                        "price": 40,
                        "is_available": true
                    }
                ]
            }
        }
    ],
    "restaurant_id": "1"
}

  getMenu(id: number){
    console.log('get call for api', id)
    return this.response1.menu
  }

  submitOrder(body){
    this._http.post(this._submit_url, body).subscribe(
      data => console.log('Successful ', data),
      error => console.log('Error: ', error) 
    )
  }
}
