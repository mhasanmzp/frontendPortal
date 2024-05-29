import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-kra',
  templateUrl: './view-all-kra.component.html',
  styleUrls: ['./view-all-kra.component.scss'],
})
export class ViewAllKraComponent implements OnInit {
  teams: any = [];
  years: any = [];
  month: any = 1;
  year: any;
  selectedTeam: any = [];
  teamEmployees: any = [];
  months: any = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  TEAM: any = [
    { teamName: 'Parul', teamId: 1 },
    { teamName: 'Sonali', teamId: 2 },
    { teamName: 'Vikash', teamId: 3 },
    { teamName: 'Vishal', teamId: 4 },
    { teamName: 'Faisal', teamId: 5 },
  ];
  dsrData: any = [];
  allMonthDates: any = [];
  employeeIds: any = [];
  permissionViewAllDSR: boolean = false;
  allKRA: any;
  response: any;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private tasksService: TasksService,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    let date = new Date();
    this.month = date.getMonth() + 1;
    let year = date.getFullYear();
    for (let i = 0; i < 10; i++)
      this.years.push(year - i);
    this.year = year;

    // this.commonService.fetchAllTeams().then(teamData => {
    //   this.teams = teamData;
    //   this.selectedTeam = teamData[0].teamId;
    //   this.teamEmployees = teamData[0].users;
    //   this.employeeIds = this.teamEmployees;
    //   // this.filterDsr();
    //   console.log(this.employeeIds)
    // });

    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.projectService.getTeamsReporting().then((resp: any) => {
          console.log("getTeamsReporting resp ", resp)
          if (resp.length > 0) {
            this.teams = resp;
            this.teams.forEach(element => {
              if (element.teamName == "Development") {
                this.selectedTeam = element.teamId;
                this.teamEmployees = element.users;
              }
            });
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
    })
    this.getKRA();
  }

  getKRA() {
    this.commonService.presentLoading();
    this.commonService.getAllKra().then((res: any) => {
      this.commonService.loadingDismiss();
      console.log('response', res);
      this.allKRA = res;
      this.response = res;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  teamChanged(event) {
    let filteredTeams = this.teams.filter(team => event.indexOf(team.teamId) > -1)
    let employeesIds = [];
    filteredTeams.forEach(team => {
      employeesIds = employeesIds.concat(team.users);
    })
    this.employeeIds = employeesIds;
    // this.filterDsr();
    console.log(this.employeeIds)
  }

  checkStatus(dsr, date) {
    // let fDate = this.year + '-' + this.addLeadingZeros(this.month, 2) + '-' + this.addLeadingZeros(date, 2);
    // let filtered = dsr.result.filter(r => r.date == fDate);
    // if (filtered && filtered[0] && filtered[0].dsrStatus == 'Completed')
    //   return 1;
    // else if (filtered && filtered[0] && filtered[0].dsrStatus == 'In-Complete')
    //   return 2;
    // else
    return 0
  }

  filterKra() {
    let monthName
    for (let i = 1; i < this.months.length; i++) {
      if (this.month == this.months[i].value) {
        monthName = this.months[i].name
      }
    }
    console.log(monthName)
    this.allKRA = this.response.filter((val: any) => (val.month == monthName))
    // let monthDates = new Date(this.year, this.month, 0).getDate();
    // this.allMonthDates = [];
    // for (let i = 1; i <= monthDates; i++)
    //   this.allMonthDates.push(i);
    //   console.log("this.allMonthlyDates",this.allMonthDates,this.year)

    // this.tasksService.filterDsr({ employeeIds: this.employeeIds, month: this.month, year: this.year }).then((resp: any) => {
    //   // console.log("resp filterDsr ",resp);
    //   this.dsrData = resp;
    //   resp.forEach(emp => {
    //     let d = emp.result;
    //     for (let i = 1; i <= monthDates; i++) {
    //       let fDate = this.year + '-' + this.addLeadingZeros(this.month, 2) + '-' + this.addLeadingZeros(i, 2);
    //       // console.log(" fDate ",fDate);
    //       let filtered = d.filter(r => r.date == fDate);
    //       // console.log(" filtered ",filtered);
    //       if (filtered.length == 0) {
    //       }
    //     }
    //   })
    //   console.log("resp this.allMonthDates ", this.allMonthDates);
    // })
  }

  updateKRA(data) {
    localStorage.setItem('kraDetails', JSON.stringify(data));
    localStorage.setItem('kraFlag', 'updatePerform');
    this.router.navigateByUrl('/edit-kra');
  }
}
