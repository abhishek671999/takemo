import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  headers:any;
  constructor(private _http: HttpClient) { }
  host = "http://65.20.75.191:8001/api/v1/"
  _getMenuEndpoint = 'inventory/get_menu/'
  _submit_url = 'inventory/create_order/'

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
                        "is_available": false
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
                    },
                    {
                      "id": 5,
                      "name": "Mango",
                      "price": 40,
                      "is_available": true
                  },
                  {
                    "id": 5,
                    "name": "Mango",
                    "price": 40,
                    "is_available": true
                },
                {
                  "id": 5,
                  "name": "Mango",
                  "price": 40,
                  "is_available": true
              },
              {
                "id": 5,
                "name": "Mango",
                "price": 40,
                "is_available": true
            },
            {
              "id": 5,
              "name": "Mango",
              "price": 40,
              "is_available": true
          },
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

getToken(){
  return localStorage.getItem('token')
}
  getMenu(id: number){
    let queryParams = new HttpParams()
    console.log('Getting menu for id: ', id)
    const headers = new HttpHeaders({'Authorization': 'Token ' + this.getToken()})
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(this.host+this._getMenuEndpoint, {params: queryParams, headers: headers})
  }

  submitOrder(body){
    this._http.post(this.host+this._submit_url, body).subscribe(
      data => console.log('Successful ', data),
      error => console.log('Error: ', error) 
    )
  }
}
