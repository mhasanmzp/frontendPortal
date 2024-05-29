import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { concatAll } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ProjectService } from 'src/app/services/project.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveComponent implements OnInit {
  selectedTeam: any;
  teams: any = [];
  toDate: any;
  fromDate: any;
  teamEmployees: any = [];
  leavedetails: any;
  leaveLength: any;
  response: any;

  selectAllCheckBox: any;
  checkBoxes: HTMLCollection | any;
  customAlertOptions: any = {
    header: 'Select Team',
    subHeader: 'Select All:',
    message: `<ion-checkbox id="selectAllCheckBox"></ion-checkbox>`
  };

  constructor(public modalController: ModalController,
    public authService: AuthService, private alertController: AlertController,
    private projectService: ProjectService, private router: Router,
    private commonService: CommonService,@Inject(DOCUMENT) private document: Document, private renderer: Renderer2,) { }

  ngOnInit() {
    // let date = new Date();
    // this.toDate = this.commonService.formatDate(date.setDate(date.getDate() - 7));
    // this.fromDate = this.commonService.formatDate(new Date());
    // this.toDate = this.commonService.formatDate(new Date());

    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.projectService.getTeamsReporting().then((resp: any) => {
          // console.log("getTeamsReporting resp ", resp)
          if (resp.length > 0) {
            this.teams = resp;
            this.selectedTeam = [resp[0].teamId];
            this.teamEmployees = resp[0].users;
            this.getLeaveDetail();
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
    });

  }

  teamChanged(event) {
    let employees = [];
    let selectedTeams = this.teams.filter(t => this.selectedTeam.indexOf(t.teamId) != -1);
    selectedTeams.forEach(team => {
      employees = employees.concat(team.users);
    })
    employees = employees.filter((item, index) => {
      return (employees.indexOf(item) == index)
    })

    this.teamEmployees = employees;
    // console.log(this.teamEmployees, this.selectedTeam)
    this.getLeaveDetail();
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


  getLeaveDetail() {
    this.commonService.presentLoading();
    this.commonService.getLeaves(this.teamEmployees).then((res: any) => {
      this.response = res;
      this.leavedetails = res;
      this.leaveLength = res.length;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  displayImage(data, name) {
    // var image = new Image();
    // image.src =  data;

    // var w = window.open("");
    // w.document.write(image.outerHTML);
    const link = document.createElement("a");
    link.href = data;
    link.download = `${name}_certificate.pdf`
    link.click();
  }

  async rejectLeave(data, item) {
    let form = {
      "leaveId": data,
      'status': 'Rejected'
    }

    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to reject this leave.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.updateLeave(form).then((res: any) => {
              // this.getLeaveDetail();
              item.status = 'Rejected'
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async approveLeave(data, item) {
    let form = {
      "leaveId": data,
      'status': 'Approved'
    }

    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to approve this leave.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.updateLeave(form).then((res: any) => {
              // this.getLeaveDetail();
              item.status = 'Approved'
            }, error => {
              this.commonService.showToast('error', error.error)
            });
          },
        },
      ],
    });

    await alert.present();
  }

  dateChange() {
    // console.log(this.toDate, this.fromDate)
    if (this.toDate > this.fromDate) {
      this.commonService.showToast("error", "End date sholud be greater then start date.")
    } else {
      this.leavedetails = (this.toDate && this.fromDate) ? this.response.filter((val: any) => (val.sdate >= this.toDate && val.sdate <= this.fromDate)) : '';
      if (this.leavedetails.length == 0) {
        this.commonService.showToast("error", "Data not found");
        this.leavedetails = this.response;
        this.toDate = '';
        this.fromDate = '';
      }
    }

    console.log('this.leavedetails', this.leavedetails)
  }
}
