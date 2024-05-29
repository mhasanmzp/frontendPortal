import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-leave',
  templateUrl: './view-all-leave.page.html',
  styleUrls: ['./view-all-leave.page.scss'],
})
export class ViewAllLeavePage implements OnInit {
  toDate: any;
  fromDate: any;
  status: any = "0";
  selectedStatuses: any = [0];
  selectedTeam: any;
  teams: any = [];
  teamEmployees: any = [];
  permissionViewAllDSR: boolean = false;
  leavedetails: any = [];
  leaveLength: any;
  response: any = [];
  filterLeave: any = [];

  selectAllCheckBox: any;
  checkBoxes: HTMLCollection | any;
  customAlertOptions: any = {
    header: 'Select Team',
    subHeader: 'Select All:',
    message: `<ion-checkbox id="selectAllCheckBox"></ion-checkbox>`
  };
  getLeave: any;
  getLeaveRecord: any;
  userId: string;

  constructor(public authService: AuthService, public commonService: CommonService, private alertController: AlertController,
    @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,private router:Router) { }

  ngOnInit() {
    let date = new Date();
    this.toDate = this.commonService.formatDate(date.setDate(date.getDate() - 7));
    this.fromDate = this.commonService.formatDate(new Date());
    this.userId = localStorage.getItem('userId');
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        // this.getLeave()
        // this.getLeaveRecord();        
        this.commonService.fetchAllTeams().then(resp => {
          this.teams = resp;
          // this.selectedTeam = resp[0].teamId;
          // this.teamEmployees = resp[0].users;
          this.teams.forEach(element => {
            if (element.teamName == "Development") {
              this.selectedTeam = element.teamId;
              this.teamEmployees = element.users;
            }
          });
          this.getLeaveDetail();
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
    let employees = [];
    let selectedTeams = this.teams.filter(t => this.selectedTeam.indexOf(t.teamId) != -1);
    selectedTeams.forEach(team => {
      employees = employees.concat(team.users);
    })
    employees = employees.filter((item, index) => {
      return (employees.indexOf(item) == index)
    })

    this.teamEmployees = employees;
    console.log(this.teamEmployees, this.selectedTeam)
    this.getLeaveDetail();
  }

  statusChanged(event) {
    this.filterLeave = [];
    this.selectedStatuses = event;
    this.toDate = '';
    this.fromDate = '';
    // this.getLeaveDetail();
    if (this.selectedStatuses == '1') {
      this.response.forEach(element => {
        if (element.status == 'New') {
          this.filterLeave.push(element)
        }
      });
    } else if (this.selectedStatuses == '2') {
      this.response.forEach(element => {
        if (element.status == 'Approved') {
          this.filterLeave.push(element)
        }
      });
    } else if (this.selectedStatuses == '3') {
      this.response.forEach(element => {
        if (element.status == 'Revoke') {
          this.filterLeave.push(element)
        }
      });
    } else if (this.selectedStatuses == '4') {
      this.response.forEach(element => {
        if (element.status == 'Rejected') {
          this.filterLeave.push(element)
        }
      });
    } else {
      this.getLeaveDetail();
    }
    this.leavedetails = this.filterLeave
    // console.log(this.leavedetails)
  }

  dateChange() {
    console.log(this.toDate, this.fromDate);
    this.leavedetails = (this.toDate && this.fromDate) ? this.response.filter((val: any) => (val.sdate >= this.toDate && val.sdate <= this.fromDate)) : '';
    console.log(this.leavedetails)
  }

  getLeaveDetail() {
    this.commonService.presentLoading();
    this.filterLeave = [];
    this.commonService.presentLoading();
    this.commonService.getLeaves(this.teamEmployees).then((res: any) => {
      // this.commonService.loadingDismiss();
      console.log(res);
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

  displayImage(data) {
    var image = new Image();
    image.src = data;

    var w = window.open("");
    w.document.write(image.outerHTML);
  }

  searchEmployee(event) {
    // console.log("event ",event.target.value)
    let searchTerm = event.target.value;
    this.leavedetails = searchTerm ? this.response.filter((data: any) => ((data.firstName + " " + data.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || (data.firstName + " " + data.lastName).toUpperCase().includes(searchTerm.toUpperCase()) || (data.firstName + " " + data.lastName).includes(searchTerm))) : this.response;
  }
  async declineLeave(data) {
    let form = {
      "leaveId": data,
      'status': 'Revoke'
    }
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to revoke your leave',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.commonService.updateLeave(form).then((res: any) => {
              console.log(res);
              this.getLeaveDetail();
            }, error => {
              this.commonService.showToast('error', error.error.msg);
              if (error.error.statusCode == 401) {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigateByUrl('/login')
              }
            })
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  downloadLeave() {
    let form = {
      employeeId: this.teamEmployees,
      sdate: this.toDate,
      edate: this.fromDate
    }
    this.commonService.presentLoading()
    this.commonService.downloadLeave(form).then((res: any) => {
      if (res.code == 1) {
        this.exportToExcel(res.resp, 'EmployeeLeaves')
      } else {
        this.commonService.showToast("error", res.msg)
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

  async exportToExcel(data, filename) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }

}
