import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-add-user-to-rule',
  templateUrl: './add-user-to-rule.component.html',
  styleUrls: ['./add-user-to-rule.component.css'],
})
export class AddUserToRuleComponent {
  constructor(
    public _fb: FormBuilder,
    private _rulesServices: RulesService,
    @Inject(MAT_DIALOG_DATA) public data,
    public matDialogRef: MatDialogRef<AddUserToRuleComponent>
  ) {}

  formControl = new FormControl('');
  filteredOptions: Observable<string[]>;

  options = ['one'];
  displayOptions = [];
  companies = [
    { company_name: 'select company', company_id: 0 },
    { company_name: 'In time tec', company_id: 1 },
  ];
  selected_company = this.companies[0];

  restaurants = [
    { restaurant_name: 'Select Restaurant', restaurant_id: 0 },
    { restaurant_name: 'Amulya Kitchen', restaurant_id: 1 },
    { restaurant_name: 'Amrit Kitchenen', restaurant_id: 2 },
  ];
  selected_restaurant = this.restaurants[0];

  ngOnInit() {
    this._rulesServices.getITTUsers().subscribe((data) => {
      console.log('This is data: ', data);
      this.options = data['itt_users'];
      this.options.forEach((ele) =>
        this.displayOptions.push(ele['user_email'])
      );
      console.log('This is options: ', this.displayOptions);
      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this.displayOptions.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase() || '')
          )
        )
      );
    });
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  disableRestaurantField() {
    console.log('Checking disable', this.selected_company);
    if (this.selected_company.company_id > 0) {
      return true;
    }
    return false;
  }

  disableCompanyField() {
    if (this.selected_restaurant.restaurant_id > 0) {
      return true;
    }
    return false;
  }

  onClick() {
    console.log('FormControl', this.formControl);
    console.log('selected: ', this.selected_company, this.selected_restaurant);
    let emailIndex = this.displayOptions.indexOf(this.formControl.value);
    let user_id = this.options[emailIndex]['user_id'];
    let body = {
      user_id: user_id,
      rule_id: this.data['rule_id'],
    };
    this.selected_company['company_id'] > 0
      ? (body['company_id'] = this.selected_company['company_id'])
      : (body['restaurant_id'] = this.selected_restaurant['restaurant_id']);
    console.log('This is body: ', body);
    this._rulesServices.addUserToRule(body).subscribe(
      (data) => {
        this.matDialogRef.close({ success: 'ok' });
      },
      (error) => {
        let exceptionMessage = '';
        console.log('Error while adding', error.error.exception);
        if (error.error.exception.toLowerCase().includes('duplicate')) {
          exceptionMessage = 'User already added to this shift';
        }
        this.matDialogRef.close({ success: 'failed', msg: exceptionMessage });
      }
    );
  }

  isDisabled() {
    let index_is = this.displayOptions.indexOf(this.formControl.value) >= 0;
    let isRestaurantOrCompanySelected =
      this.selected_company.company_id > 0 ||
      this.selected_restaurant.restaurant_id > 0;
    return index_is && isRestaurantOrCompanySelected;
  }
}
