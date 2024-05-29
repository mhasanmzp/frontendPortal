import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { MenuController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.page.html',
  styleUrls: ['./client-dashboard.page.scss'],
})
export class ClientDashboardPage implements OnInit {
  daysInWeek: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  today: any;
  customer: any = {};
  allProjects: any = [];

  constructor(public router: Router, public authService: AuthService, public projectService: ProjectService,
    private menuController: MenuController, private commonService: CommonService,) { }

  ngOnInit() {
    this.today = new Date();
    console.log("app-client-dashboard ")

    this.authService.getUserDetails(localStorage.getItem('userId'), 'customer').then((resp: any) => {
      this.customer = resp;
      console.log('customer ', resp)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        this.logout();
      }
    })
    this.commonService.getCustomerProjects({ customerId: localStorage.getItem('userId') }).then((resp: any) => {
      console.log('customer project', resp)
      this.allProjects = resp;
      this.commonService.loadingDismiss();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        this.logout();
      }
    })
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  getDayOfWeek(taskDate) {
    let date = new Date(taskDate);
    let day = date.getDay();
    return this.daysInWeek[day];
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
