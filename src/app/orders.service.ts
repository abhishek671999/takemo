import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  mock_response = {
    "orders": [
        {
            "order_id": 1,
            "ordered_by": {
                "id": 1,
                "email": "abcd@test.com",
                "first_name": "Abcd",
                "last_name": "xyz"
            },
            "restaurant": {
                "id": 1,
                "name": "abcd"
            },
            "total_amount": 123,
            "is_done": false,
            "ordered_time": "date time",
            "done_time": "date time",
            "order_no": 1,
            "order_details": [
                {
                    "item_id": 1,
                    "item_name": "abc",
                    "quantity": 2,
                    "price": 100
                },
                {
                    "item_id": 2,
                    "item_name": "xyz",
                    "quantity": 2,
                    "price": 100
                }
            ]
          }
        ]
      }

  getCurrentOrders(){
    return this.mock_response
  }
}
