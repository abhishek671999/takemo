import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { SuccessMsgDialogComponent } from '../../success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../../error-msg-dialog/error-msg-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/user_screen/confirmation-dialog/confirmation-dialog.component';
import { ConfirmActionDialogComponent } from '../../confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent {
  constructor(
    private restaurantService: RestaurantService, 
    private meUtility: meAPIUtility,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ){}
  
  public addEmployeeForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    email: ['', [Validators.required]],
    gender: ['', [Validators.required]]
  })

  private restaurantId!: number
  public employeeDetails = []

  ngOnInit(){
    this.meUtility.getRestaurant().subscribe(
      (data: any) => {
        this.restaurantId = data['restaurant_id']
        this.fetchRestaurantEmployees()
      }
    )
  }

  fetchRestaurantEmployees(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId)
    this.restaurantService.getRestaurantEmployees(httpParams).subscribe(
      (data: any) =>{
        data['employees'].forEach(employee => {
          employee['is_edit'] = false
        })
        this.employeeDetails = data['employees']
      },
      (error: any) => console.log(error)
    )
  }

  addEmployee(){
    let body = {
      restaurant_id: this.restaurantId,
      name: this.addEmployeeForm.value.name,
      mobile: this.addEmployeeForm.value.mobile,
      email: this.addEmployeeForm.value.email,
      gender: this.addEmployeeForm.value.gender
    }
    this.restaurantService.addEmployee(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgDialogComponent, {data: {msg: 'Employee added successfully'}})
        this.addEmployeeForm.reset()
        this.addEmployeeForm.markAsUntouched()
        this.ngOnInit()
      },
    )
  }

  enableEditTable(employee){
    employee.is_edit = !employee.is_edit
  }

  editEmployee(employee, event){
    let body = {
      restaurant_id: this.restaurantId,
      employee_id: employee.employee_id,
      name: employee.name,
      mobile: employee.mobile,
      email: employee.email,
      gender: employee.gender
    }
    this.restaurantService.editEmployee(body).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  deleteEmployee(employee){
    let dialogRef = this.matDialog.open(ConfirmActionDialogComponent, {data: `Are you sure want to delete ${employee.name}??`})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.select){
          let body = {
            restaurant_id: this.restaurantId,
            employee_id: employee.employee_id,
          }
          this.restaurantService.deleteEmployee(body).subscribe(
            (data: any) => {
              this.ngOnInit()
            }
          )
        }
      }
    )

  }

}
