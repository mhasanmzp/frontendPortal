import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
// import { AddCVPage } from './add-cv/add-cv.page';

@Component({
  selector: 'app-ats',
  templateUrl: './ats.page.html',
  styleUrls: ['./ats.page.scss'],
})
export class AtsPage implements OnInit {
  allCVresponse: any;
  searchData: any;
  sCtc: any;
  eCtc: any;
  response: any;

  constructor(public modalController: ModalController, private authService: AuthService, private commonService: CommonService,
    private router:Router,private alertController: AlertController,) { }

  ngOnInit() {
    this.getAllCV();
  }

  // async addCV() {
  //   const popover = await this.modalController.create({
  //     component: AddCVPage,
  //     cssClass: 'leave-modal',
  //     // componentProps: {test: "123"},
  //     showBackdrop: true
  //   });
  //   await popover.present();
  //   popover.onDidDismiss().then(resp => {
  //     this.getAllCV();
  //   })
  // }

  getAllCV() {
    this.authService.userLogin.subscribe((resp: any) => {
      this.commonService.getCVPool({ organisationId: resp.organisationId }).then((res: any) => {
        console.log(res)
        this.allCVresponse = res;
        this.response = res;
      })
    });
  }

  displayCV(data) {
    console.log(data.filename)
    let url = this.authService.apiUrl + 'resume/' + data.filename
    window.open(url, '_blank');
  }

  async deleteCV(id) {
    console.log('delete',id)
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this CV.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.deleteCVPool({ 'id': id }).then((res: any) => {
              console.log(res)
              if (res.msg) {
                this.commonService.showToast('success', res.msg);
                this.getAllCV();
              }else{
                this.commonService.showToast("error","Something went wrong.")
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  updateCV(data) {
    console.log('update',data);
    // this.router.navigateByUrl('/add-cv',{state:{"cvData":data}})
  }

  searchCV() {
    if(this.searchData || this.sCtc || this.eCtc){
      let form = {
        search: this.searchData,
        sCtc: this.sCtc,
        eCtc: this.eCtc
      }
      console.log('CV Search',form);
      this.commonService.searchCV(form).then((res:any) => {
        console.log(res);
        this.allCVresponse = res
      })
    }else{
      this.allCVresponse = this.response
    }
  }

  viewCV(data){

  }
}
