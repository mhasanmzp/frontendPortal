import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import Toastr from 'toastr2';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  toastr: any;
  url: any = 'https://f21e-203-92-37-218.ngrok-free.app/';
  header: any = {
    'ngrok-skip-browser-warning': 'true',
  };
  ticket = new Subject();


  constructor(private http: HttpClient,  public toast: ToastController) { }
  showToast(action: any, message: any) {
    this.toastr = new Toastr();
    this.toastr.options.closeDuration = 1000;
    this.toastr.options.progressBar = true;
    this.toastr.options.positionClass = 'toast-bottom-right';
    this.toastr[action](message, action + '!', { timeOut: 3000 });
  }
  // employee api of manin screen
fetchAppraisalInfo(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'allAppraisalInfoOfAnEmp', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
}
//  employee 2 screen rating submit button api
submitRatings(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'employeeEvaluation', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
}
// manager screen api
fetchEmployee(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'appraisalListL2L3L4L5', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
 }
 //  manager screen  employee rating
fetchRating(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'anAppraisalDetailsOfEmpEval', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
 }
 setTicket(ticketCount: any) {
  console.log(ticketCount);
  this.ticket.next(ticketCount);
}
//  manager screen  Manager rating
fetchmanagerRating(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'employeeEvaluationByL2', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
 }
 //  manager screen manager  form
 fetchmanagerReview(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'managersEvaluation', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
 }
//  employee basic deatils on top manager screen
 fetchemployeedetails(data: any) {
  return new Promise((resolve, reject) => {
    this.http
      .post(this.url + 'anEmpBasicDetails', data, {
        headers: this.header,
      })
      .subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
  });
 }
}
