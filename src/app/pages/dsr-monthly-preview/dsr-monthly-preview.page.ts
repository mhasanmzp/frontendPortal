import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../../services/tasks.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dsr-monthly-preview',
  templateUrl: './dsr-monthly-preview.page.html',
  styleUrls: ['./dsr-monthly-preview.page.scss'],
})
export class DsrMonthlyPreviewPage implements OnInit {
  @Input() flag: any;

  teams: any = [];
  years: any = [];
  month: any = 1;
  year: any;
  selectedTeam: any;
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
  ]
  dsrData: any = [];
  allMonthDates: any = [];
  employeeIds: any = [];
  permissionViewAllDSR: boolean = false;
  TEAMNAME: any;

  constructor(
    private commonService: CommonService, private router: Router,
    private authService: AuthService,
    private tasksService: TasksService,
    private projectService: ProjectService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.flag);

    let date = new Date();
    this.month = date.getMonth() + 1;
    let year = date.getFullYear();
    for (let i = 0; i < 10; i++)
      this.years.push(year - i);
    this.year = year;

    this.authService.userLogin.subscribe((userData: any) => {

      this.projectService.getTeamsReporting().then((reportingTeamData: any) => {
        this.TEAMNAME = reportingTeamData;
        this.teams = reportingTeamData;
        console.log("getTeamsReporting this.teams ", this.teams)

        if (reportingTeamData.length > 0) {
          this.selectedTeam = reportingTeamData[0].teamId;
          // console.log("getTeamsReporting this.selectedTeam ", this.selectedTeam)
          this.teamEmployees = reportingTeamData[0].users;
          // console.log("getTeamsReporting this.teamEmployees ", this.teamEmployees)
          this.employeeIds = this.teamEmployees;
          // console.log("getTeamsReporting this.employeeIds ", this.employeeIds)
        }

        this.permissionViewAllDSR = userData.permissions.ViewAllDSR
        this.commonService.fetchAllTeams().then(teamData => {
          if (this.permissionViewAllDSR) {
            if (this.flag == 'view-dsr') {
              this.teams = this.TEAMNAME
            }
            else {
              this.teams = teamData;
            }
            // this.selectedTeam = teamData[0].teamId;
            // this.teamEmployees = teamData[0].users;
            this.teams.forEach(element => {
              if (element.teamName == "Development") {
                this.selectedTeam = element.teamId;
                this.teamEmployees = element.users;
              }
            });
            this.employeeIds = this.teamEmployees;
            this.filterDsr();
          }
        })



      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })

    })
  }

  filterDsr() {

    let monthDates = new Date(this.year, this.month, 0).getDate();
    this.allMonthDates = [];
    for (let i = 1; i <= monthDates; i++)
      this.allMonthDates.push(i);
    console.log("this.allMonthlyDates", this.allMonthDates, this.year)

    this.tasksService.filterDsr({ employeeIds: this.employeeIds, month: this.month, year: this.year }).then((resp: any) => {
      // console.log("resp filterDsr ",resp);
      this.dsrData = resp;
      resp.forEach(emp => {
        let d = emp.result;
        for (let i = 1; i <= monthDates; i++) {
          let fDate = this.year + '-' + this.addLeadingZeros(this.month, 2) + '-' + this.addLeadingZeros(i, 2);
          // console.log(" fDate ",fDate);
          let filtered = d.filter(r => r.date == fDate);
          // console.log(" filtered ",filtered);
          if (filtered.length == 0) {
          }
        }
      })
      console.log("resp this.allMonthDates ", this.allMonthDates);
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  teamChanged(event) {
    let filteredTeams = this.teams.filter(team => event.indexOf(team.teamId) > -1)
    let employeesIds = [];
    filteredTeams.forEach(team => {
      employeesIds = employeesIds.concat(team.users);
    })
    this.employeeIds = employeesIds;
    this.filterDsr();
  }

  checkStatus(dsr, date) {
    let fDate = this.year + '-' + this.addLeadingZeros(this.month, 2) + '-' + this.addLeadingZeros(date, 2);
    let filtered = dsr.result.filter(r => r.date == fDate);
    if (filtered && filtered[0] && filtered[0].dsrStatus == 'Completed')
      return 1;
    else if (filtered && filtered[0] && filtered[0].dsrStatus == 'In-Complete')
      return 2;
    else
      return 0
  }

}
