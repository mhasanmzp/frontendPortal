
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.page.html',
  styleUrls: ['./capacity.page.scss'],
})
export class CapacityPage implements OnInit {
  customers: any = [];
  timeframe: any = 'month'
  department: any = 'all';
  form_date:any;
  to_date:any;
  userId:any;
  dropDownData: any;
  allRequest:any=[];
// allRequest:any=[
//   {"emp_Code":1234,"emp_Name":"absd","Dep":"SAP","AvailHours":45,"AllocateHours":25,"catingHR":950},
//   {"emp_Code":5834,"emp_Name":"absd","Dep":"Dev","AvailHours":45,"AllocateHours":28,"catingHR":1250},
//   {"emp_Code":9234,"emp_Name":"absd","Dep":"Recruitment","AvailHours":45,"AllocateHours":30,"catingHR":100000},
//   {"emp_Code":3534,"emp_Name":"absd","Dep":"HR","AvailHours":45,"AllocateHours":29,"catingHR":650},
// ]
  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }
  populateData(){
    let form={
      form:this.form_date,
      to:this.to_date,
      page: 1,
      pageSize: 7,
      permissionName: "Dashboard",
      employeeIdMiddleware: this.userId
    }
    console.log("payload is ",form)
    this.commonService.presentLoading();
    this.commonService.getCapacity(form).then((res: any) => {
     this.allRequest=res.data;
      console.log('teams id response', res); 
    }, error => {
      this.commonService.showToast('error', error.error.msg);
    })
  }
  selectionChanged(ev: any) {
    this.dropDownData = ev.detail
    console.log("data of dropdown list", this.dropDownData)
  }
  editDetails(data) {
   
    alert("edit popup");
  }
  onEdit(item: any) {
    // debugger;
    item.isEdit = true;

  }
  oncancel(item: any) {
    item.isEdit = false;
  }
}
