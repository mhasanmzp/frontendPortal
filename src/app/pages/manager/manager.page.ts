import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReviewService } from 'src/app/services/review.service';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReviewformPage } from '../reviewform/reviewform.page';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {

  entries: any[] = [];
  navController: any;
  detail: any[] = [];
  totalSum = 0;
  userId: any=localStorage.getItem('userId');
  appraisalId: any;
  data2: any;

  constructor(
    public modalController: ModalController,
    private reviewservice: ReviewService,
    private commonService: CommonService,
    private http: HttpClient,
    private navCtrl: NavController ,
    private router: Router
  ) { }

  async addcreate(data: any) {
    const popover = await this.modalController.create({
      component: ReviewformPage,
      cssClass: 'leave-modal',
      showBackdrop: true,
      componentProps: { ticketData: data },
    });
    this.modalController.dismiss();
    await popover.present();
    popover.onDidDismiss().then((resp) => {
    });
  }

  ngOnInit() {
  this.fetchEmployee();

  }

  openForm(item: any) {
    console.log('hello hi ', item);
    this.router.navigate(['./reviewform/' + item.appraisalId]);
  }


  logEntries(){
    console.log(this.detail);
  }




  fetchEmployee() {
    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId:this.userId
    };

    this.reviewservice.fetchEmployee(payload).then(
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

  retrieveAppraisalInfo(){
    const storeData =localStorage.getItem('appraisalInfo');
    if (storeData) {
      const appraisalInfo = JSON.parse(storeData);
      console.log(appraisalInfo);
      this.detail=appraisalInfo;
    }
  }

}
