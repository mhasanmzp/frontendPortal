import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../../services/tasks.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { DsrMonthlyPreviewPage } from '../../pages/dsr-monthly-preview/dsr-monthly-preview.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-dsr',
  templateUrl: './view-dsr.component.html',
  styleUrls: ['./view-dsr.component.scss'],
})
export class ViewDsrComponent implements OnInit {
  selectedTeam: any;
  toDate: any;
  fromDate: any;
  status: any = "1";
  dsrEmployees: any = [];
  employees: any = []
  teams: any = []
  teamEmployees: any = []
  permissionViewAllDSR: boolean = false;

  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
    private projectService: ProjectService,
    private commonService: CommonService,
    public modalCtrl: ModalController, private router: Router
  ) { }

  ngOnInit() {
    this.toDate = this.commonService.formatDate(new Date());
    this.fromDate = this.commonService.formatDate(new Date());

    this.authService.userLogin.subscribe((resp: any) => {
      this.projectService.getTeamsReporting().then((resp: any) => {
        this.teams = resp;
        // this.selectedTeam = resp[0].teamId;
        // this.teamEmployees = resp[0].users;
        // this.getDSR(resp[0].users)
        this.teams.forEach(element => {
          if (element.teamName == "Development") {
            this.selectedTeam = element.teamId;
            this.teamEmployees = element.users;
            this.getDSR(element.users)
          }
        });

        this.permissionViewAllDSR = resp.permissions.ViewAllDSR
        this.commonService.fetchAllTeams().then(resp => {
          if (this.permissionViewAllDSR) {
            this.teams = resp;
            // this.selectedTeam = resp[0].teamId;
            // this.teamEmployees = resp[0].users;
            // this.getDSR(resp[0].users)
            this.teams.forEach(element => {
              if (element.teamName == "Development") {
                this.selectedTeam = element.teamId;
                this.teamEmployees = element.users;
                this.getDSR(element.users)
              }
            });
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

  teamChanged(event) {
    let selectedTeams = this.teams.filter(t => this.selectedTeam.indexOf(t.teamId) != -1);
    let employees = [];
    selectedTeams.forEach(team => {
      employees = employees.concat(team.users);
    })
    employees = employees.filter((item, index) => {
      return (employees.indexOf(item) == index)
    })
    this.teamEmployees = employees;
    this.getDSR(employees)
  }

  getDSR(employees) {
    this.commonService.getDSR({ employeeId: employees, from: this.fromDate, to: this.toDate }).then((dsrs: any) => {
      let dsrArray = [];
      dsrs.forEach(dsr => {
        dsrArray.push(dsr.details)
      })
      this.dsrEmployees = dsrArray;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  // async openCalendar() {
  //   const options: CalendarModalOptions = {
  //     pickMode: 'range',
  //     title: 'RANGE',
  //     color:'dark'
  //   };

  //   const myCalendar = await this.modalCtrl.create({
  //     component: CalendarModal,
  //     componentProps: { options }
  //   });

  //   myCalendar.present();

  //   const event: any = await myCalendar.onDidDismiss();
  //   const date = event.data;
  //   const from: CalendarResult = date.from;
  //   const to: CalendarResult = date.to;

  //   console.log(date, from, to);
  //   this.date = from.string +" - "+to.string
  // }

  parseFloat(number) {
    return parseFloat(number).toFixed(2);
  }

  acceptTask(task) {
    task.status = 1;
    task.approverId = localStorage.getItem('userId')
    task.approverName = localStorage.getItem('employeeName')
    task.approvedDate = this.commonService.formatDate(new Date());
    // console.log('task',task)
    this.tasksService.updateTask(task).then(resp => {

    })
  }

  dateChange(ev) {
    let that = this;
    setTimeout(() => {
      that.getDSR(this.teamEmployees)
    }, 500);
  }

  rejectTask(task) {
    task.status = 2;
    task.approverId = localStorage.getItem('userId')
    task.approverName = localStorage.getItem('employeeName')
    task.approvedDate = this.commonService.formatDate(new Date());
    // console.log('task',task)
    this.tasksService.updateTask(task).then(resp => {

    })
  }

  async previewFilterDSR() {

    const popover = await this.modalCtrl.create({
      component: DsrMonthlyPreviewPage,
      cssClass: 'dsr-preview-modal',
      //    enterAnimation(baseEl) {
      //     const wrapperAnimation = createAnimation()
      //     .beforeStyles({
      //       transform: 'translateY(0) scale(1)'
      //     })
      //     .addElement(baseEl.shadowRoot.querySelector('.modal-wrapper'));

      //   return createAnimation()
      //     .addElement(baseEl)
      //     .duration(250)
      //     .fromTo('opacity', '0', '1')
      //     .addAnimation([wrapperAnimation]);
      // },
      showBackdrop: true
    });
    await popover.present();
  }

}
