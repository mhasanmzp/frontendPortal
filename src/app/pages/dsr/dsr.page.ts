import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dsr',
  templateUrl: './dsr.page.html',
  styleUrls: ['./dsr.page.scss'],
})
export class DsrPage implements OnInit {
  date: any;
  team: any = "1";
  status: any = "1";
  dsrEmployees: any = [];
  employees: any = []

  constructor(
    private tasksService: TasksService,private router:Router,
    private commonService: CommonService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.date = this.commonService.formatDate(new Date());
    this.commonService.getDSR({employeeId: [9,4,31], from: "2022-08-1", to: "2022-08-20"}).then((dsrs:any) => {
      let dsrArray = [];
      dsrs.forEach(dsr => {
        dsrArray.push(dsr.details)
      })
      this.dsrEmployees = dsrArray;
      console.log("dsrArray ", dsrArray)
    },error=>{
      this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
    })
  }

  parseFloat(number){
    return parseFloat(number).toFixed(2);
  }

  acceptTask(task){
    task.status = 1;
    task.approverId = localStorage.getItem('userId')
    task.approverName = localStorage.getItem('employeeName')
    task.approvedDate = this.commonService.formatDate(new Date());
    // console.log('task',task)
    this.tasksService.updateTask(task).then(resp => {

    },error=>{
      this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
    })
  }

  rejectTask(task){
    task.status = 2;
    task.approverId = localStorage.getItem('userId')
    task.approverName = localStorage.getItem('employeeName')
    task.approvedDate = this.commonService.formatDate(new Date());
    // console.log('task',task)
    this.tasksService.updateTask(task).then(resp => {
      
    },error=>{
      this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
    })
  }

}
