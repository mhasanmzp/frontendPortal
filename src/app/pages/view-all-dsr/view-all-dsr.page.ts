import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../../services/tasks.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { DsrMonthlyPreviewPage } from '../../pages/dsr-monthly-preview/dsr-monthly-preview.page';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-dsr',
  templateUrl: './view-all-dsr.page.html',
  styleUrls: ['./view-all-dsr.page.scss'],
})
export class ViewAllDsrPage implements OnInit {
  selectedTeam: any;
  toDate: any;
  fromDate: any;
  status: any = "0";
  dsrEmployees: any = [];
  allEmployeesReal: any = [];
  employees: any = []
  teams: any = []
  teamEmployees: any = []
  selectedStatuses: any = [0]
  permissionViewAllDSR: boolean = false;
  isReportingManager: boolean = false;

  selectAllCheckBox: any;
  checkBoxes: HTMLCollection | any;
  customAlertOptions: any = {
    header: 'Select Team',
    subHeader: 'Select All:',
    message: `<ion-checkbox id="selectAllCheckBox"></ion-checkbox>`
  };

  constructor(
    public authService: AuthService,
    public tasksService: TasksService,
    public projectService: ProjectService,
    public commonService: CommonService,private router:Router,
    public modalCtrl: ModalController, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.commonService.presentLoading();
    
    let date = new Date();
    this.toDate = this.commonService.formatDate(date.setDate(date.getDate() - 7));
    this.fromDate = this.commonService.formatDate(new Date());

    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.permissionViewAllDSR = resp.permissions.ViewAllDSR
        this.commonService.fetchAllTeams().then(resp => {
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

  }

  searchEmployee(event) {
    // console.log("event ",event.target.value)
    this.teamEmployees = [];
    let searchTerm = event.target.value;
    this.dsrEmployees = searchTerm ? this.allEmployeesReal.filter(e => ((e.firstName + " " + e.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || (e.firstName + " " + e.lastName).toUpperCase().includes(searchTerm.toUpperCase()) || (e.firstName + " " + e.lastName).includes(searchTerm))) : this.allEmployeesReal;
    this.dsrEmployees.forEach(element => {
      this.teamEmployees.push(element.employeeId)
    });
  }

  openSelector(selector) {
    selector.open().then((alert) => {
      this.selectAllCheckBox = this.document.getElementById("selectAllCheckBox");
      this.checkBoxes = this.document.getElementsByClassName("alert-checkbox");
      this.renderer.listen(this.selectAllCheckBox, 'click', () => {
        if (this.selectAllCheckBox.checked) {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute("aria-checked") === "false") {
              (checkbox as HTMLButtonElement).click();
            };
          };
        } else {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute("aria-checked") === "true") {
              (checkbox as HTMLButtonElement).click();
            };
          };
        }
      });
      alert.onWillDismiss().then(() => {
        this.teamChanged(this.selectAllCheckBox.checked);
      });
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
    console.log(this.teamEmployees, this.selectedTeam)
    this.getDSR(employees)
  }

  statusChanged(event) {
    this.selectedStatuses = event;
    this.getDSR(this.teamEmployees)
  }

  getDSR(employees) {
    this.commonService.getDSR({ statuses: this.selectedStatuses, employeeId: employees, from: this.fromDate, to: this.toDate }).then((dsrs: any) => {
      let dsrArray = [];
      dsrs.forEach(dsr => {
        dsrArray.push(dsr.details)
      })
      this.dsrEmployees = dsrArray;
      this.allEmployeesReal = dsrArray;
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
    if (number) {
      return parseFloat(number).toFixed(2);
    } else {
      return 0;
    }
  }

  acceptTask(task) {
    task.status = 1;
    task.approverId = localStorage.getItem('userId')
    task.approverName = localStorage.getItem('employeeName')
    task.approvedDate = this.commonService.formatDate(new Date());
    // console.log('task',task)
    this.tasksService.updateTask(task).then(resp => {

    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
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

  downloadDSR() {
    var date: any = moment(new Date());
    let url = this.authService.apiUrl + "downloadDsr?employeeIds=" + this.teamEmployees.join(',') + "&to=" + this.fromDate + "&from=" + this.toDate + "&timezone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("downloadDSR ", url);
    console.log("Intl.DateTimeFormat().resolvedOptions().timeZone ", Intl.DateTimeFormat().resolvedOptions().timeZone);
    window.location.assign(url);
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
