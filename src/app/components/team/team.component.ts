import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../../services/tasks.service';
import { DashboardService } from '../../services/dashboard.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { DsrMonthlyPreviewPage } from '../../pages/dsr-monthly-preview/dsr-monthly-preview.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  selectedTeam: any;
  toDate: any;
  fromDate: any;
  status: any = '0';
  dsrEmployees: any = [];
  employees: any = []
  teams: any = []
  teamEmployees: any = []
  allTeams: any = []
  selectedStatuses: any = [0]

  constructor(
    public authService: AuthService,
    private tasksService: TasksService,
    private projectService: ProjectService,
    private dashboardService: DashboardService,
    private commonService: CommonService,
    public modalCtrl: ModalController, private router: Router
  ) { }

  ngOnInit() {
    let date = new Date();
    this.toDate = this.commonService.formatDate(new Date());
    this.fromDate = this.commonService.formatDate(date.setDate(date.getDate() - 7));
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.projectService.getTeamsReporting().then((resp: any) => {
          console.log("getTeamsReporting resp ", resp)
          if (resp.length > 0) {
            this.teams = resp;
            this.selectedTeam = [resp[0].teamId];
            this.teamEmployees = resp[0].users;
          }
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
        this.fetchAllTeams();
      }
    })

  }

  fetchAllTeams() {
    this.commonService.fetchAllTeams().then(resp => {
      this.allTeams = resp;
      console.log('*********', this.allTeams)
      // this.getEmployeesByIds(this.allTeams[this.selectedTeam]['users']);
      this.allTeams.forEach((team, m) => {
        this.dashboardService.filterByTeam({ employeeId: team.users, teamId: team.teamId, from: this.commonService.formatDate(this.fromDate), to: this.commonService.formatDate(this.toDate) }).then((data: any) => {
          console.log("resp dashboardService filterByTeam ", data);
          let billableHours = 0;
          let nonBillableHours = 0;
          let totalHours = 0;
          data.forEach(element => {
            billableHours += element['billable']
            nonBillableHours += element['nonBillable']
            totalHours = totalHours + (element['billable'] + element['nonBillable'])
            element['utilization'] = ((element['billable'] + (element['nonBillable'] / 3)) / (element['billable'] + element['nonBillable'])) * 100;
          });
          team['billableHours'] = billableHours;
          team['nonBillableHours'] = nonBillableHours;
          team['totalHours'] = totalHours;
          team['members'] = data;
          team['utilizationPer'] = ((billableHours + (nonBillableHours / 3)) / totalHours) * 100;
        })
      })
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }


  parseFloat(number) {
    return parseFloat(number).toFixed(2);
  }

  dateChange(ev) {
    let that = this;
    setTimeout(() => {
      that.fetchAllTeams()
    }, 500);
  }

}
