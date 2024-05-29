import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { AddLeavePage } from './add-leave/add-leave.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.page.html',
  styleUrls: ['./leaves.page.scss'],
})
export class LeavesPage implements OnInit {
  userId: any;
  leavedetails: any;
  responseLength: any;
  employees: any = [];
  leaveBalances: any = {}
  totalLeave: any;
  remainingLeave: any = [];
  appliedLeave: any = [];
  height: any = 0;
  selectedUserGroup: string | null; // Initialize it as null or with a default value


  constructor(public modalController: ModalController, private authService: AuthService,
    private commonService: CommonService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.getUserType();
    this.userId = localStorage.getItem('userId');
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.getLeave();
        // this.getUserLeaveBalance();
        this.getLeaveRecord();
      }
    })

    this.height = (window.innerHeight - 310) + 'px'
  }

  async addLeave() {
    const popover = await this.modalController.create({
      component: AddLeavePage,
      cssClass: 'leave-modal',
      componentProps: { remainingLeave: this.remainingLeave },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {
      this.getLeave();
    })
  }

  getLeave() {
    this.commonService.presentLoading();
    this.commonService.getUserLeaves({ employeeId: this.userId }).then((res: any) => {
      console.log('response', res);
      this.leavedetails = res;
      this.responseLength = res.length;
      let month = new Date().getMonth() + 1;
      let fullYear = new Date().getFullYear();
      let date = new Date().getDate();
      console.log("month",new Date())
      let currentDate = fullYear+'-'+month+'-'+25;
      let nextYearDate = (fullYear+1)+'-'+month+'-'+25;
      let sickDays = 0, paidDays = 0, wfh = 0;
      this.leavedetails.forEach(element => {
        if(element.sdate>=currentDate && element.sdate<=nextYearDate && element.edate>=currentDate && element.edate<=nextYearDate)
        {
          if (element.leaveType == 'sick' && element.status == "Approved") {
            sickDays += (+element.days)
          } else if (element.leaveType == 'halfDaySick' && element.status == "Approved") {
            sickDays += (+element.days)
          } else if (element.leaveType == 'paid' && element.status == "Approved") {
            paidDays += (+element.days)
          } else if (element.leaveType == 'halfDayPaid' && element.status == "Approved") {
            paidDays += (+element.days)
          } else if (element.leaveType == 'WFH' && element.status == "Approved") {
            wfh += (+element.days)
          }
        }
      })

      this.appliedLeave['sick'] = sickDays;
      this.appliedLeave['wfh'] = wfh;
      if (this.userId == '139') {
        this.appliedLeave['paid'] = paidDays - 3;
      } else {
        this.appliedLeave['paid'] = paidDays;
      }

      this.getLeaveRecord();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getUserLeaveBalance() {
    this.commonService.getUserLeaveBalance().then((res: any) => {
      this.leaveBalances = res;
      console.log(res);
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getLeaveRecord() {
    // debugger;
    this.commonService.getUserLeaveRecord().then((res: any) => {
      this.totalLeave = res[0];
      this.remainingLeave['sick'] = 0; this.remainingLeave['paid'] = 0; this.remainingLeave['wfh'] = 0;
      if (this.totalLeave.sick_leaves > this.appliedLeave['sick']) {
        this.remainingLeave['sick'] = this.totalLeave.sick_leaves - this.appliedLeave['sick'];
      }
      if (this.totalLeave.paid_leaves > this.appliedLeave['paid']) {
        this.remainingLeave['paid'] = this.totalLeave.paid_leaves - this.appliedLeave['paid'];
      }
      if (this.totalLeave.wfh > this.appliedLeave.wfh) {
        this.remainingLeave['wfh'] = this.totalLeave.wfh - this.appliedLeave.wfh;
      }
      this.totalLeave.month = new Date().getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
      this.totalLeave.year = new Date().getFullYear();
    });
  }

  displayImage(data) {
    // var image = new Image();
    // image.src =  data;

    // var w = window.open("");
    // w.document.write(image.outerHTML);
    const link = document.createElement("a");
    link.href = data;
    link.download = `certificate.pdf`
    link.click();
  }
  getUserType(): void {
    // Fetch the selectedUserGroup value from localStorage or wherever it's stored
    this.selectedUserGroup = localStorage.getItem('selectedUserGroup');
  }

  isUserAllowedToDeclineLeave(): boolean {
    return ['141', '134', '344'].includes(this.userId);
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
              this.getLeave();
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

  editLeave(data) {
    console.log("EDIT")
  }
}
