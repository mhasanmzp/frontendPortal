import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RaisedTicketPage } from 'src/app/modals/raised-ticket/raised-ticket.page';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  isModalOpen = false;
  status: any;
  updateCommentForm: FormGroup;

  allTickets: any;
  offset: any = 0;
  segment: any = 'All';

  constructor(
    public modalController: ModalController,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ticket: any = [];
  ngOnInit() {
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp.employeeId) {
        this.fetchTicket();
      }
    });
  }

  async addTicket(data: any) {
    const popover = await this.modalController.create({
      component: RaisedTicketPage,
      cssClass: 'leave-modal',
      showBackdrop: true,
      componentProps: { ticketData: data },
    });
    this.modalController.dismiss();
    await popover.present();
    popover.onDidDismiss().then((resp) => {
      this.offset = 0;
      this.fetchTicket();
    });
  }

  fetchTicket() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');
    this.commonService
      .getGrievance({
        employeeId: userId,
        offset: this.offset,
        status: this.status,
      })
      .then(
        (res: any) => {
          console.log('response', res);
          this.allTickets = res;
          this.offset += 20;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
  }

  getMoreData(event) {
    let userId = +localStorage.getItem('userId');

    this.commonService
      .getGrievance({
        employeeId: userId,
        offset: this.offset,
        status: this.status,
      })
      .then(
        (res: any) => {
          console.log('response', res);
          this.allTickets = this.allTickets.concat(res);
          this.offset += 20;
          if (event) event.target.complete();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (event) event.target.complete();
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
  }

  /// filter data according to status
  segmentChanged(ev) {
    this.offset = 0;
    this.status = ev.target.value;
    this.allTickets = [];
    if (this.status == 'All') this.status = null;
    this.fetchTicket();
  }
}
