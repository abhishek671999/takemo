import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { ViewImageComponent } from '../../dialogbox/view-image/view-image.component';
import { MatTableDataSource } from '@angular/material/table';
import { CaptureImageComponent } from '../../subcomponents/capture-image/capture-image.component';

@Component({
  selector: 'app-attendence-management',
  templateUrl: './attendence-management.component.html',
  styleUrls: ['./attendence-management.component.css']
})
export class AttendenceManagementComponent {
  constructor(
    private restaurantService: RestaurantService, 
    private meUtility: meAPIUtility, 
    private dateUtils: dateUtils,
    private matDialog: MatDialog
  ){}
  
  private restaurantId!: number
  public selectedDate = new Date()
  public today = new Date()
  public attendanceDataSource = new MatTableDataSource()
  public attedanceTableColumns = ['sl_no', 'date', 'name', 'punch_in', 'punch_out']

  ngOnInit(){
    this.meUtility.getRestaurant().subscribe(
      (data: any) => {
        this.restaurantId = data['restaurant_id']
        this.fetchAttendance()
      }
    )
  }

  fetchAttendance(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId)
    httpParams = httpParams.append('date', this.dateUtils.getStandardizedDateFormate(this.selectedDate))
    this.restaurantService.getAttendence(httpParams).subscribe(
      (data: any) => {
        this.attedanceTableColumns = this.dateUtils.getStandardizedDateFormate(this.selectedDate) == this.dateUtils.getStandardizedDateFormate(this.today)? ['sl_no', 'date', 'name', 'punch_in', 'punch_out']: ['sl_no', 'date', 'name']
        this.attendanceDataSource = data['attendance_list']
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  punchIn(employee){
    let dialogRef = this.matDialog.open(CaptureImageComponent)
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.file){
          const formData = new FormData();
          formData.append('file', data.file);
          formData.append('employee_id', employee.employee_id)
          this.restaurantService.punchIn(formData).subscribe(
            (data: any) => {
              debugger
              employee.punch_in = this.dateUtils.getStandardizedDateTimeFormate(new Date())
            },
            (error: any) => {
              console.log(error)
            }
          )
        }
      }
    )
  }

  punchOut(employee){
    let dialogRef = this.matDialog.open(CaptureImageComponent)
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.file){
          const formData = new FormData();
          formData.append('file', data.file);
          formData.append('employee_id', employee.employee_id)
          this.restaurantService.punchOut(formData).subscribe(
            (data: any) => {
              employee.punch_out = this.dateUtils.getStandardizedTimeFormate(new Date())
            },
            (error: any) => {
              console.log(error)
            }
          )
        }
      }
    )
  }

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }

}
