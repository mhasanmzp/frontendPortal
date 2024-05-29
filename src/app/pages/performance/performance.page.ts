import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
})
export class PerformancePage implements OnInit {
  allKRA: any;
  kraLength: any;
  kraMonth: any = [];

  constructor(private alertController: AlertController,
    public authService: AuthService, public router: Router,
    public commonService: CommonService,) {
  }

  ngOnInit() {
    this.getKRA();
  }

  ionViewWillEnter() {
    this.getKRA();
  }

  getKRA() {
    this.kraMonth = [];
    this.commonService.presentLoading();
    this.authService.userLogin.subscribe((resp: any) => {
      this.commonService.getUserKRA({ employeeId: resp.employeeId }).then((res: any) => {
        // this.commonService.loadingDismiss();
        console.log('response', res);
        this.allKRA = res;
        this.kraLength = res.length;
        for (let i = 0; i < this.kraLength; i++) {
          this.kraMonth.push({ 'month': this.allKRA[i].month, 'year': this.allKRA[i].year });
        }
        console.log("MONTH", this.kraMonth);
        localStorage.setItem('Months', JSON.stringify(this.kraMonth))
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      });

    })

  }

  updateKRA(data) {
    localStorage.setItem('kraDetails', JSON.stringify(data));
    localStorage.setItem('kraFlag', 'update');
    this.router.navigateByUrl('/edit-kra');
  }

  createKRA() {
    this.router.navigateByUrl('/add-kra')
  }

  async deleteKRA(id: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this KRA.',
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
            this.commonService.deleteKRA({ kraId: id }).then((res: any) => {
              // console.log(res);
              this.commonService.showToast("success", res.msg);
              this.getKRA();
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
  }
}
