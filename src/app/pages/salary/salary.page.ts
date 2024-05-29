import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.page.html',
  styleUrls: ['./salary.page.scss'],
})
export class SalaryPage implements OnInit {
  allRequests: any = [];
  allYears: any = [];
  allMonths: any = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  year: any;
  month: any;

  constructor(private commonService: CommonService,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let date = new Date();
    this.allYears = [];
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    // console.log("year ",this.year)
    // console.log("month ",this.month)
    for (let i = 0; i <= 10; i++)
      this.allYears.push(parseInt(this.year) - i)
    // this.fetchEmployee(null);
  }

  ////Fetch Employees who are on boarding
  fetchEmployee(ev) {
    let formData = {
      organisationCode: localStorage.getItem('organisationId'),
      month: this.month,
      year: this.year,
    }
    this.commonService.getMonthlySalary(formData).then((resp: any) => {
      this.allRequests = resp;
      console.log("response from getEmployee", this.allRequests)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  ////Method to navigate on onboarding page for updating details

  generateSalaries() {
    let formData = {
      organisationId: localStorage.getItem('organisationId'),
      month: this.month,
      year: this.year,
    }
    this.commonService.generateSalaries(formData).then((resp: any) => {
      this.fetchEmployee(null)
      console.log("response from getEmployee", this.allRequests)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  toFixed(amt) {
    return amt.toFixed(2)
  }
}
