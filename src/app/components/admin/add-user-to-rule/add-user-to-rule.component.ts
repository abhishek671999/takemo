import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-add-user-to-rule',
  templateUrl: './add-user-to-rule.component.html',
  styleUrls: ['./add-user-to-rule.component.css']
})
export class AddUserToRuleComponent {

  constructor(public _fb: FormBuilder,
    private _rulesServices: RulesService,
    @Inject(MAT_DIALOG_DATA) public data){}

   formControl = new FormControl('')
   options: string[] = ['One', 'Two', 'Three'];
   filteredOptions: Observable<string[]>;

   ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onClick(){
    console.log("FormControl", this.formControl)
    console.log(this.options.indexOf(this.formControl.value))
    let body = {
      "rule_id": this.data['rule_id'],
      "restaurant_id": 1,
      "user_id": this.options.indexOf(this.formControl.value) + 1
    }
    console.log('This is body', body)
    this._rulesServices.addUserToRule(body).subscribe(
      data => {
        console.log(data)
        alert('User added')
      },
      error => {
        console.log(error)
        alert('Something went wrong')
      }
    )
  }

  isDisabled(){
    return this.options.indexOf(this.formControl.value) >= 0
  }
   Options = [{email: 'abhishek.akkannavar@gmail.com', id: 1}, {email: 'raghav@gmail.com', id: 2}]


}
