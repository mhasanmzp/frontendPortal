import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import * as Rx from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  domainAndScreenPermissions = new Rx.BehaviorSubject({});
  userDetails = new Rx.BehaviorSubject({});
  userLogin = new Rx.BehaviorSubject({});
  orgOnboarded = new Rx.BehaviorSubject({});
  updatePermissions = new Rx.BehaviorSubject(false);
  userGroup: any = {};
  // apiUrl: any = 'http://localhost:3000/';
  apiUrl: any = 'https://api.hr.timesofpeople.com/';
  geturl: string;
  posturl: string;
  userType: string;
  organisationId: any;
  userId: any;
  // oragsanisationId
  token:any;
  header:any
  jwt_token: any;
  constructor(
    public http: HttpClient,
    public authService: AuthService
    ) {
      // this.token = localStorage.getItem('token')
      // this.header = new HttpHeaders().set('jwtToken', this.token)
      this.jwt_token=localStorage.getItem('jwt_token');
      this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
     }

  createFeedback(feedback) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createFeedback', feedback,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  organisationUpdate(organisationData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'organisationUpdate', organisationData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getRandomQuote() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.quotable.io/random').subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'login', data).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  getNewsFeed() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getNewsFeed',{},{headers:this.header}).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
}

