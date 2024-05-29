import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-attendance',
  templateUrl: './user-attendance.page.html',
  styleUrls: ['./user-attendance.page.scss'],
})
export class UserAttendancePage implements OnInit {

  data: any;
  response: any;
  responseLength: any;
  name: any;
  ID: any;
  userId: any;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.commonService.presentLoading();
    this.data = JSON.parse(localStorage.getItem('attendanceData'))
    this.ID = this.route.snapshot.paramMap.get("id")
    this.userId = JSON.parse(localStorage.getItem('userId'))
    console.log(JSON.parse(this.ID));

    if (this.ID) {
      this.name = this.data.firstName + ' ' + this.data.lastName
      this.commonService.getUserAttendance({ 'employeeId': this.ID }).then((res: any) => {
        console.log(res, res.length);
        this.response = res;
        this.responseLength = res.length
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
    else {
      // this.authService.userLogin.subscribe((resp: any) => {
      this.name = localStorage.getItem("employeeName")
      this.commonService.getUserAttendance({ 'employeeId': this.userId }).then((res: any) => {
        console.log(res);
        this.response = res;
        this.responseLength = res.length
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
      // })
    }
  }

}
