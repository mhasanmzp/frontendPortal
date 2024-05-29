import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import Toastr from 'toastr2';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AppraisalService {
  token: any;
  header: any;
  loading: any;
  loading1: any;
  toastr: any;
  apiUrl = 'https://f21e-203-92-37-218.ngrok-free.app/';
  constructor(public authService: AuthService,
    public http: HttpClient,
    public loadingController: LoadingController,
    public toast: ToastController) { }

    showToast(action: any, message: any) {
      this.toastr = new Toastr();
      this.toastr.options.closeDuration = 1000;
      this.toastr.options.progressBar = true;
      this.toastr.options.positionClass = 'toast-top-right';
      this.toastr[action](message, action + '!', { timeOut: 3000 });
    }
    department(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'departments', data).subscribe((resp: any) => {
          resolve(resp);
        }, error => {
          reject(error);
        });
      });
    }
    employeeList(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'empList', data).subscribe((resp: any) => {
          resolve(resp);
        }, error => {
          reject(error);
        });
      });
    }
    mainScreenList(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'hrMainScreen', data).subscribe ((resp: any) => {
          resolve(resp);
        },error => {
          reject(error);
        });
      });
    }
    selectManager(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'employees', data).subscribe ((resp: any) => {
          resolve(resp);
        },error => {
          reject(error);
        });
      });
    }
    selectHr(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'hrList', data).subscribe ((resp: any) => {
          resolve(resp);
        },error => {
          reject(error);
        });
      });
    }
    employeeManagerStore(data: any){
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + 'empmangStore', data).subscribe((resp: any) => {
          resolve(resp);
        },error =>{
          reject(error);
        });
      });
    }
    employeeManagerFetch(data: any){
      return new Promise((resolve,reject) => {
        this.http.post(this.apiUrl + 'empmangFetch', data).subscribe((resp: any) => {
          resolve(resp);
        },error => {
          reject(error);
        });
      });
    }
    employeeManagerUpdate(data: any){
      return new Promise((resolve,reject) => {
        this.http.post(this.apiUrl + 'empmangUpdate', data).subscribe((resp: any) => {
          resolve(resp);
        },error => {
          reject(error);
        });
      });
    }

    employeeAppraisalAmount(data: any){
      return new Promise ((resolve, reject) => {
        this.http.post(this.apiUrl + 'hrRatingAmountStorage', data).subscribe((resp: any) => {
          resolve(resp);
        },error =>{
          reject(error);
        });
      });
      }

employeeAmountShow(data: any){
  return new Promise ((resolve, reject) => {
    this.http.post(this.apiUrl + 'hrRatingAmountInfo', data).subscribe((resp: any) => {
      resolve(resp);
    },error => {
      reject(error);
    });
  });
}
      loadingDismiss() {
        this.loading.dismiss();
      }
      loadingDismiss1() {
        this.loading1.dismiss();
      }


      initiateEmployee(data: any){
        return new Promise((resolve, reject) => {
          this.http.post(this.apiUrl + 'initiateAppraisal', data).subscribe((resp: any) => {
            resolve(resp);
          },error => {
            reject(error);
          });
        });
      }

}
