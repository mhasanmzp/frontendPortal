import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-log',
  templateUrl: './view-log.page.html',
  styleUrls: ['./view-log.page.scss'],
})
export class ViewLogPage implements OnInit {

  allRecords: any;
  allRecordsReal: any;
  count: any = 0;
  date: any;
  allEmployee: any;
  employeeId: any;

  constructor(private authService: AuthService, private commonService: CommonService,private router:Router) { }

  ngOnInit() {
    this.getLogsDetails(this.count);
  }

  ionViewWillEnter() {
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.fetchEmployee();
      }
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getLogsDetails(offset) {
    let form = {
      offset: 10 * offset
    }
    this.authService.getLogTable(form).then((res: any) => {
      this.allRecords = res
      this.allRecordsReal = res
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  previewLog() {
    if (this.count > 0) {
      this.count = this.count - 1
    }
    if (this.date) {
      this.filterDate(this.date);
    }
    if (this.employeeId) {
      this.filterId()
    }
    else {
      this.getLogsDetails(this.count)
    }
  }

  nextLog() {
    this.count = this.count + 1
    if (this.date) {
      this.filterDate(this.date)
    }
    if (this.employeeId) {
      this.filterId()
    }
    else {
      this.getLogsDetails(this.count)
    }
  }

  filterDate(event) {
    this.date = event.target ? event.target.value : event;
    this.count = 0;
    this.employeeId = ''
  }

  filter() {
    let form = {
      offset: 10 * this.count,
      date: this.date
    }
    this.authService.getLogTableByDate(form).then((resp: any) => {
      this.allRecords = resp
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  fetchEmployee() {
    this.commonService.getEmployeeList().then((resp: any) => {
      this.allEmployee = resp
      console.log('employee', resp)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  filterEmployee(event) {
    this.employeeId = event.target.value
    this.count = 0;
    this.date = ''
    this.filterId();
  }

  filterId() {
    let form = {
      offset: 10 * this.count,
      employeeId: this.employeeId
    }
    this.authService.getLogTableByEmployeeId(form).then((resp: any) => {
      this.allRecords = resp
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }
}
