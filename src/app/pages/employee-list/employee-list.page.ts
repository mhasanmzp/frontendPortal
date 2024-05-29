import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {
  allEmployees: any = [];
  allEmployeesReal: any = [];
  loader: boolean = false;
  employeeType: any = 0;
  allTeam: any;
  selectedTeam: any;
  allEmployees1: any;

  constructor(
    public commonService: CommonService,
    public authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    // this.fetchEmployee()
  }

  ionViewWillEnter() {
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.fetchEmployee();
        this.employeeType = 0
      }
    })
  }

  ////Fetch Employees who are on boarding
  fetchEmployee() {
    this.commonService.presentLoading();
    this.commonService.getEmployeeList().then((resp: any) => {
      // console.log(resp)
      this.allEmployees = resp;
      this.allEmployeesReal = resp;
      this.allEmployees1 = resp;
      this.loader = false;
      this.fetchAllTeams();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  fetchAllTeams() {
    this.commonService.fetchAllTeams().then(resp => {
      // console.log(resp);
      this.allTeam = resp
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  searchTeam(event) {
    this.selectedTeam = event.target.value;
    // console.log(this.selectedTeam)
    if (this.selectedTeam == 'search') {
      this.allEmployees = this.allEmployeesReal
    } else {
      this.allTeam.forEach(element => {
        if (element.teamId == this.selectedTeam) {
          // console.log('element.users',element.users)
          this.allEmployees = [];
          this.allEmployees = this.allEmployeesReal.filter(e => element.users.includes(e.employeeId))
          // this.allEmployeesReal.forEach(ele => {
          //   if(element.users.includes(ele.employeeId)){
          //     this.allEmployees.push(ele);
          //     this.allEmployees1.push(ele);
          //   }
          // });
        }
      });
      // console.log('allEmployees',this.allEmployees)
    }

  }

  searchEmployeeType(event) {
    console.log(event.target.value);
    let searchType = event.target.value;
    if (searchType == 0) {
      this.allEmployees = this.allEmployeesReal
    } else {
      let employee;
      if (this.selectedTeam != 'search')
        employee = this.allEmployees1.filter((emp: any) => emp.employeeType == searchType)
      else
        employee = this.allEmployeesReal.filter((emp: any) => emp.employeeType == searchType)

      if (employee.length > 0) {
        this.allEmployees = employee;
      }
    }
    console.log("*****", this.allEmployees)
  }

  searchEmployee(event) {
    console.log("event ", event.target.value)
    let searchTerm = event.target.value;
    let emp;
    if (this.selectedTeam != 'search')
      emp = this.allEmployees1.filter(e => e.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    else
      emp = this.allEmployeesReal.filter(e => e.firstName.toLowerCase().includes(searchTerm.toLowerCase()))

    if (emp.length > 0) {
      this.allEmployees = emp;
    }
    // else{
    //   this.commonService.showToast('error','No data found');
    //   this.allEmployees = [];
    //   this.loader = true;
    //   // this.allEmployees = this.allEmployeesReal
    // }
    console.log('allEmployees', emp)
  }

  ////Method to navigate on onboarding page for updating details

  updateEmployee(request: any) {
    this.router.navigate(['/employee-onboarding/' + request.employeeId]);
  }

  /**  16-02-2023, download employee list, ritika singh */
  downloadList() {
    this.commonService.downloadEmployeeList()
  }
}
