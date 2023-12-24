import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  contactList = [
    {
      name: 'Raghavendra Swaroop',
      phone: '+91 7022915219',
      email: 'swaroop.9796@gmail.com'
    },
    {
      name: 'Abhishek A A',
      phone: '+91 8792932297',
      email: 'abhishekakkannavar@gmail.com'
    }
  ]
}
