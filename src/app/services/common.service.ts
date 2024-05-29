import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Router,
  NavigationExtras,
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import * as Rx from 'rxjs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Toastr from 'toastr2';
import { resolve } from 'dns';
import { rejects } from 'assert';
// import { resolve } from 'dns';

@Injectable({
  providedIn: 'root',
})
export class CommonService implements HttpInterceptor {
  // Ankit Code
  ticket = new Subject();
  // conveyance = new Subject();
  // End of Ankit Code

  [x: string]: any;
  // apiUrl: any = 'https://9fdd-103-44-52-185.ngrok-free.app/';
  apiUrl1: any =  'https://bb08-203-92-37-218.ngrok-free.app/';
  // apiUrl: any = 'http://localhost:3000/';
  // apiUrl: any = 'http://159.223.177.89:3000/';

  loading: any;
  loading1: any;
  currentUrl: any;
  employeeId: any = localStorage.getItem('userId');
  notificationUpdated = new Rx.BehaviorSubject(false);
  routeUrl: any;
  public appPages = [
    {
      title: 'Dashboard',
      url: 'dashboard',
      icon: 'bar-chart',
      permission: 'Dashboard',
    },
    {
      title: 'Employee List',
      url: 'employee-list',
      icon: 'people',
      permission: 'EmployeeList',
    },
    {
      title: 'Employee List',
      url: 'employee-onboarding',
      icon: 'people',
      permission: 'EmployeeList',
    },
    {
      title: 'Attendance',
      url: 'attendance',
      icon: 'document',
      permission: 'Attendance',
    },
    {
      title: 'Performance',
      url: 'performance',
      icon: 'trending-up',
      permission: 'Performance',
    },
    {
      title: 'My attendance',
      url: 'user-attendance',
      icon: 'document',
      permission: 'UserAttendance',
    },
    { title: 'My Tasks', url: 'tasks', icon: 'list', permission: 'Tasks' },
    {
      title: 'View All DSRs',
      url: 'view-all-dsr',
      icon: 'eye',
      permission: 'ViewAllDSR',
    },
    {
      title: 'Projects',
      url: 'projects',
      icon: 'grid',
      permission: 'Projects',
    },
    {
      title: 'Project Management',
      url: 'project-manage',
      permission: 'Dashboard',
    },
    // { title: "Minutes of Meeting", url: 'mom', icon: 'recording' },
    {
      title: 'Teams',
      url: 'teams',
      icon: 'people-circle',
      permission: 'Teams',
    },
    {
      title: 'My Leaves',
      url: 'leaves',
      icon: 'calendar',
      permission: 'Leaves',
    },
    {
      title: 'View All Leaves',
      url: 'view-all-leave',
      icon: 'calendar',
      permission: 'ViewAllLeave',
    },
    {
      title: 'View All Logs',
      url: 'view-log',
      icon: 'document',
      permission: 'ViewAllLog',
    },
    {
      title: 'Leave Report',
      url: 'all-user-leave-admin',
      icon: 'calendar',
      permission: 'LeaveReport',
    },
    {
      title: 'Expenses',
      url: 'expenses',
      icon: 'cash',
      permission: 'Expenses',
    },
    {
      title: 'ATS/CV Pool',
      url: 'ats',
      icon: 'file-tray-full',
      permission: 'ATSCVPool',
    },
    {
      title: 'Inventory',
      url: 'inventory',
      icon: 'information-circle',
      permission: 'Inventory',
    },
    {
      title: 'Grievance',
      url: 'tickets',
      icon: 'information-circle',
      permission: 'Tickets',
    },
    {
      title: 'User Groups',
      url: 'user-groups',
      icon: 'albums',
      permission: 'UserGroups',
    },
    {
      title: 'Fixed Asset Tracking',
      url: 'asset',
      icon: 'grid',
      permission: 'Leaves',
    }, 

    // { title: 'View All KRA', url: 'view-all-kra', icon: 'eye', permission: 'ViewAllKRA'},
    // { title: 'Profile', url: 'profile', icon: 'person' },
    // { title: 'Settings', url: 'settings', icon: 'settings' },
  ];
  token: any = localStorage.getItem('token');
  header: any;
  jwt_token:any=localStorage.getItem('jwt_token');
  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public authService: AuthService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public router: Router
  ) {
    this.apiUrl = this.authService.apiUrl;
    this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.getUrl()).pipe(
      switchMap((currentRoute: any) => {
        // this.routeUrl.unsubscribe()
        let url = currentRoute.split('/')[1];
        console.log("----", url);
        this.employeeId = localStorage.getItem('userId');
        if (url) {
          let permission = this.appPages.filter((el) => el.url == url)[0];
          if (permission) {
            this.currentUrl = this.appPages.filter((el) => el.url == url)[0][
              'permission'
            ];
          }
        }
        if (this.currentUrl) {
          let formData = {
            permissionName: this.currentUrl,
            employeeIdMiddleware: this.employeeId,
          };
          const req = request.clone({
            body: { ...request.body, ...formData },
          });
          return next.handle(req);
        } else {
          return next.handle(request);
        }
      })
    );
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   // this.router.events.subscribe(event => {

  //   //   if (event instanceof NavigationEnd) {
  //   //     let url = event.url.split('/')[1]
  //   //     this.currentUrl = this.appPages.filter(el => el.url == url)[0]['permission']
  //   //   }
  //   // });
  //   this.employeeId = localStorage.getItem("userId")
  //   let url = this.router.url.split('/')[1]
  //   if(url)
  //   {
  //     let permission = this.appPages.filter(el => el.url == url)[0]
  //     if(permission)
  //     {
  //       this.currentUrl = this.appPages.filter(el => el.url == url)[0]['permission']
  //     }
  //   }
  //   if (this.currentUrl) {
  //     let formData = {
  //       permissionName: this.currentUrl,
  //       employeeIdMiddleware: this.employeeId
  //     }
  //     const req = request.clone({
  //       body: { ...request.body, ...formData }
  //     })
  //     return next.handle(req)
  //   }
  //   else {
  //     return next.handle(request)
  //   }
  // }

  getUrl() {
    return new Promise((resolve, reject) => {
      let url;
      setTimeout(() => {
        url = this.router.url;
        resolve(url);
      }, 2000);
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationEnd) {
      //     resolve(event.url)
      //   }
      // },error=>{
      //   reject(error)
      // });
    });
  }

  showToast(action, message) {
    var toastr = new Toastr();
    // toastr.options.closeMethod = 'fadeOut';
    toastr.options.closeDuration = 1000;
    toastr.options.progressBar = true;
    toastr.options.positionClass = 'toast-bottom-right';
    // toastr.options.closeEasing = 'swing';
    // if(action == 'success')
    toastr[action](message, action + '!', { timeOut: 3000 });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 1000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading.present();
  }

  async presentLoading1() {
    this.loading1 = await this.loadingController.create({
      spinner: 'circles',
      // duration: 3000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading1.present();
  }

  loadingDismiss() {
    this.loading.dismiss();
  }
  loadingDismiss1() {
    this.loading1.dismiss();
  }

  registerEmployee(formData) {
    return new Promise((resolve, reject) => {
      formData.organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'employeeOnboarding', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUniqueAfterMerge(arr1, arr2) {
    // merge two arrays
    let arr = arr1.concat(arr2);
    let uniqueArr = [];

    // loop through array
    for (let i of arr) {
      if (uniqueArr.indexOf(i) === -1) {
        uniqueArr.push(i);
      }
    }
  }

  ////Create organisation api

  createOrg(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createOrganisation', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  login(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'login', formData,{ observe:'response'}).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getOrganisation(organisationId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'getOrganisation',
          { organisationId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateOrganisation(organisationData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateOrganisationDetails', organisationData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateEmployee(formData) {
    return new Promise((resolve, reject) => {
      formData.organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'updateEmployeeDetails', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateEmployeeStatus(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateEmployeeDetails', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getEmployeeList() {
    return new Promise((resolve, reject) => {
      let formData = {};
      formData['organisationId'] = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'getAllEmployee', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getEmployeeAttendence(formData) {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      formData['organisationId'] = organisationId;
      this.http
        .post(this.apiUrl + 'viewEmployeesAttendance', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserAttendance(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'viewUserAttendance', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getOneEmployee(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getoneEmployee', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getMonthlySalary(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getMonthlySalary', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  generateSalaries(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'generateSalaries', formData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createTeam(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createTeam', formData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchAllTeams() {
    return new Promise((resolve, reject) => {
      // paramsData.organisationId = this.authService.organisationId;
      this.http
        .post(
          this.apiUrl + 'fetchTeams',
          { organisationId: this.authService.organisationId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchAllUserGroups() {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'fetchAllUserGroups',
          { organisationId: localStorage.getItem('organisationId') },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchTeamColumns(teamId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'fetchTeamColumns',
          { teamId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateTeam(paramsData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateTeam', paramsData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteTeam(team) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteTeam', team, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateUserGroup(paramsData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateUserGroup', paramsData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteUserGroup(group) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteUserGroup', group, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  searchEmployees(searchTerm) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'searchEmployees',
          { searchTerm },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getEmployeesByIds(employeeIds) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'getEmployeesByIds',
          { employeeIds },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createTeamColumn(paramsData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createTeamColumn', paramsData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteTeamColumn(columnId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl + 'deleteTeamColumn',
          { columnId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserTeams() {
    return new Promise((resolve, reject) => {
      let formData = {};
      this.http
        .post(this.apiUrl + 'getUserTeams', formData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createUserGroup(paramsData) {
    return new Promise((resolve, reject) => {
      paramsData.organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'createUserGroup', paramsData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getDSR(paramsData) {
    return new Promise((resolve, reject) => {
      // paramsData.organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'filterdataTask', paramsData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for KRA
  createKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createKra', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'KraUpdate', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteKra', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getUserKra', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllKra() {
    return new Promise((resolve, reject) => {
      let formData = {};
      formData['organisationId'] = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'getAllKra', formData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getParticularUserKra(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getKraForManager', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  kraManagerRating(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'managerRating', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /// for leave
  applyLeave(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'applyLeave', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserLeaves(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getUserLeaves', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getLeaves(employees) {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(
          this.apiUrl + 'getLeaves',
          { organisationId, employees },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserLeaveBalance() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(
          this.apiUrl + 'getUserLeaveBalance',
          { employeeId: this.authService.userId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateLeave(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateLeave', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  downloadLeave(postData) {
    // let organisationId = this.authService.organisationId;
    // window.location.assign(this.apiUrl+'dowmloadAllEmployeeList'+'?employeeId='+postData.employeeId+'?sdate='+postData.sdate+'?edate='+postData.sdate)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'downloadLeaves', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserLeaveRecord() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(
          this.apiUrl + 'getUserLeaveRecord',
          {
            employeeId: this.authService.userId,
            permissionName: this.currentUrl,
            employeeIdMiddleware: this.employeeId,
          },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  ///for mass upload

  massUpload(payload: any, data: any) {
    return this.http.post(this.apiUrl + 'dailyAttendance', data);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    // console.log([year, month, day].join('-'))
    return [year, month, day].join('/');
  }

  UploadDocs(data) {
    return this.http.post(this.apiUrl + 'employeeFilesUploading', data);
  }

  getAllDocs(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getoneEmployeeDocument', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteDocs(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteDocuments', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for notes
  addNote(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createNotes', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllNotes(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'fetchNotes', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateNote(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateNotes', formData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteNote(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteNotes', formData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /// for assigned task
  getTasksAssigned(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getTasksAssigned', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTestingTasksAssigned(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getTestingTasksAssigned', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for notification
  getNotifications(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getNotifications', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for customer
  createCustomer(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createCustomer', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchCustomers() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(
          this.apiUrl + 'fetchCustomers',
          { organisationId },
          { headers: this.header }
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateCustomer(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateCustomer', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getCustomerProjects(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getCustomerProjects', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for Inventory
  createInventory(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createInventoryItems', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getInventoryDetails(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getAllInventoryItems', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateInventoryItems', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteInventoryItem', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAssignItemDetail(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getAssignItemAllDetails', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  assignInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'assignItem', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  importInventory(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'importInventoryDetails', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  downloadInventory() {
    let organisationId = this.authService.organisationId;
    window.location.assign(
      this.apiUrl +
      'exportInventoryDetails' +
      '?organisationId=' +
      organisationId
    );
  }

  // for download employee list
  downloadEmployeeList() {
    let organisationId = this.authService.organisationId;
    window.location.assign(
      this.apiUrl +
      'dowmloadAllEmployeeList' +
      '?organisationId=' +
      organisationId
    );
  }

  // for ATS or CV Pool
  addCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createCVPool', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getAllCvPool', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'deleteCv', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateCvPool', postData, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  searchCV(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'fuzzySearchforCvPool', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateEmployeeAttendance(id) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateEmployeeAttendance', id, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  userAdmin(payload: { year: number }): Promise<any> {
    {
      return new Promise((resolve, reject) => {
        this.http
          .post(this.apiUrl + 'getAllUserLeaveBalanceforAdmin', payload, {
            headers: this.header,
          })
          .subscribe(
            (resp: any) => {
              resolve(resp);
            },
            (error) => {
              reject(error);
            }
          );
      });
    }
  }
  updateleaveAdmin(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateAssignedLeave', data, {
          headers: this.header,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  //  updateleaveAdmin(data: any){
  //   return new Promise((resolve, reject)=>{
  //     this.http.post(this.apiUrl + 'updateAssignedLeave', data,{headers:this.header}).subscribe((res: any)=>{
  //       resolve(res);
  //     },error=>{
  //       reject(error)
  //     })
  //   })
  // }

  //   /**********************Grievance************* */

  //   saveGrievance(data: any) {
  //     return new Promise((resolve, reject) => {
  //       this.http.post(this.apiUrl + 'saveOrSubmitGrievance', data,{headers:this.header}).subscribe((res: any) => {
  //         resolve(res);
  //       }, error => {
  //         reject(error)
  //       })
  //     })
  //   }

  //   getGrievance(data: any) {
  //     return new Promise((resolve, reject) => {
  //       this.http.post(this.apiUrl + 'getGrievance', data,{headers:this.header}).subscribe((res: any) => {
  //         resolve(res)
  //       }, error => {
  //         reject(error)
  //       })
  //     })
  //   }

  // /**********************Grievance************* */

  saveGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'saveOrSubmitGrievance', data, {
          headers: this.header,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getGrievance', data, { headers: this.header })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getAllNewGrievance', data, {
          headers: this.header,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // need endpoint
  updateTicketData(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'assignGrievance', data, { headers: this.header })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // updateTicketComment(data:any){
  //   return new Promise((resolve, reject)=>{
  //     this.http.post(this.apiUrl + 'createTicketComment',data,{headers:this.header}).subscribe((res:any)=>{
  //       resolve(res)
  //     }, error => {
  //       reject(error)
  //     })
  //   })
  // }

  // subjectBehavior function ankit

  setTicket(ticketCount: number) {
    console.log(ticketCount);
    this.ticket.next(ticketCount);
  }

  // conveyance and allowance apis -Ankit

  createConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createConvinceAndCalm', data, {
          headers: this.header,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getConvinceAndCalm', data, {
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
  getManagerConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getManagerConvinceAndCalm', data, {
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
  updateConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateConvinceAndCalm', data, {
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

  //holidays calender
  getTeamId(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getMyTeamId', data,{ headers: this.header})
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getHoliDays(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getMyHolidays', data,{headers: this.header})
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // capacity
  getCapacity(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getCapacity', data,{
          headers: this.header})
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // subjectBehavior function ankit to refresh data after creating
  // setConveyance(data: number) {
  //   this.conveyance.next(data);
  // }

}
