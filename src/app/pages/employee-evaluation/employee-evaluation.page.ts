import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { CreateformPage } from '../createform/createform.page';
import { HttpClient } from '@angular/common/http';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-employee-evaluation',
  templateUrl: './employee-evaluation.page.html',
  styleUrls: ['./employee-evaluation.page.scss'],
})
export class EmployeeEvaluationPage implements OnInit {
  entries: any[] = [];
  detail: any;
  navController: any;
  userId: any = localStorage.getItem('userId');
  constructor(
    public modalController: ModalController,
    private http: HttpClient,
    private navCtrl: NavController,
    private reviewservice: ReviewService
  ) {}

  async addcreate(data: any) {
    const popover = await this.modalController.create({
      component: CreateformPage,
      cssClass: 'leave-modal',
      showBackdrop: true,
      componentProps: { ticketData: data },
    });
    this.modalController.dismiss();
    await popover.present();
    popover.onDidDismiss().then((resp) => {});
  }

  ngOnInit() {
    this.fetchAppraisalInfo();
    this.retrieveAppraisalInfo();
  }

  fetchAppraisalInfo() {
    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.reviewservice.fetchAppraisalInfo(payload).then(
      (response: any) => {
        this.detail = response;
        localStorage.setItem('appraisalInfo', JSON.stringify(response));
        this.entries = response;
        this.logEntries();
      },
      (error) => {
        console.error('Error fetching appraisal info:', error);
      }
    );
  }
  logEntries() {
    console.log(this.entries);
  }
  openForm(entry: any) {
    console.log('Open form for entry:', entry);
    console.log('Entry status:', entry.status);
    if (entry.status === 'complete') {
      console.log('Cannot open form for completed appraisal');
    } else {
      console.log('Navigating to /createform');
      this.navCtrl.navigateForward('/createform', {
        queryParams: {
          appraisalId: entry.appraisalId,
          employeeName: entry.name,
          designation: entry.designation,
        },
      });
    }
  }

  retrieveAppraisalInfo() {
    const storeData = localStorage.getItem('appraisalInfo');
    if (storeData) {
      const appraisalInfo = JSON.parse(storeData);
      console.log(appraisalInfo);
      this.detail = appraisalInfo;
    }
  }
}
