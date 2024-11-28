import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { ViewImageComponent } from '../../dialogbox/view-image/view-image.component';
import { MatTableDataSource } from '@angular/material/table';
import { CaptureImageComponent } from '../../subcomponents/capture-image/capture-image.component';
import { LoaderComponent } from '../../dialogbox/loader/loader.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ErrorMsgDialogComponent } from '../../error-msg-dialog/error-msg-dialog.component';

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
    private matDialog: MatDialog,
    private ng2ImgMax: Ng2ImgMaxService
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

  isSelectedDateToday(){
    return  this.dateUtils.getStandardizedDateFormate(this.selectedDate) == this.dateUtils.getStandardizedDateFormate(this.today)
  }

  fetchAttendance(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId)
    httpParams = httpParams.append('date', this.dateUtils.getStandardizedDateFormate(this.selectedDate))
    this.restaurantService.getAttendence(httpParams).subscribe(
      (data: any) => {
        
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
          let loaderDialogRef = this.matDialog.open(LoaderComponent, {data: {msg: 'Punching in'}})
          const formData = new FormData();
          formData.append('employee_id', employee.employee_id)
          const percentageReduction = 0.50;
          const targetFileSize = data.file.size * (1 - percentageReduction);
          const maxSizeInMB = targetFileSize * 0.000001;
          this.compressImage(data.file, maxSizeInMB).subscribe(
            (compressedImage) => {
              formData.append('file', compressedImage);
              this.restaurantService.punchIn(formData).subscribe(
                (data: any) => {
                  loaderDialogRef.close()
                  this.ngOnInit()
                },
                (error: any) => {
                  loaderDialogRef.close()
                  this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: error.error.description}})
                }
              )
            },
            (error) => {
              console.log('Failed to compress')
              this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to compress image'}})
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
          let loaderDialogRef = this.matDialog.open(LoaderComponent, {data: {msg: 'Punching out'}})
          const formData = new FormData();
          formData.append('employee_id', employee.employee_id)
          const percentageReduction = 0.50;
          const targetFileSize = data.file.size * (1 - percentageReduction);
          const maxSizeInMB = targetFileSize * 0.000001;
          this.compressImage(data.file, maxSizeInMB).subscribe(
            (compressedImage) => {
              formData.append('file', compressedImage);
              this.restaurantService.punchOut(formData).subscribe(
                (data: any) => {
                  loaderDialogRef.close()
                  this.ngOnInit()
                },
                (error: any) => {
                  loaderDialogRef.close()
                  this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: error.error.description}})
                }
              )
            },
            (error) => {
              console.log('Failed to compress')
              this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to compress image'}})
            }
          ) 
        }
      }
    )
  }

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }

  compressImage(file: File, maxSizeInMB: number) {
    return this.ng2ImgMax.compressImage(file, maxSizeInMB)
  }

}
