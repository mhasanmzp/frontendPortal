import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  NavController,
  Platform,
  IonInput,
  MenuController,
  AlertController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.page.html',
  styleUrls: ['./user-groups.page.scss'],
})
export class UserGroupsPage implements OnInit {
  error: any;
  form: any;
  errorMessage: any;
  userId: any;
  working: any = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };
  permissions: any = {
    // ViewAllDSR: false,
    CreateProject: false,
  };
  permissionsKeys: any = [];
  boardName: any;
  teamName: any;
  allUsers: any = [];
  allTeams: any = [];
  allUserGroups: any = [];
  managers: any = [];
  boardColumns: any = [];
  selectedGroup: any = 0;
  overlayRef: OverlayRef;
  moduleKeys: any = [];
  segment: any = 'modules';
  modules: any = {
    Dashboard: false,
    EmployeeList: false,
    Attendance: false,
    UserAttendance: false,
    Tasks: false,
    ViewAllDSR: false,
    Performance: false,
    Projects: false,
    Teams: false,
    UserGroups: false,
    Leaves: false,
    ViewAllLeave: false,
    ViewAllLog: false,
    Expenses: false,
    ATSCVPool: false,
    Inventory: false,
    Sales: false,
    LeaveReport: false,
    Tickets: false,
  };

  constructor(
    public fb: FormBuilder,
    private alertController: AlertController,
    public commonService: CommonService,
    private overlay: Overlay,
    private menuController: MenuController,
    // private loadingService: LoadingService,
    private platform: Platform,
    private authService: AuthService,
    // private userService: UserService,
    // private helperService: HelperService,
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.moduleKeys = [];
    this.authService.userLogin.subscribe((resp) => {
      this.permissionsKeys = Object.keys(this.permissions);
      this.moduleKeys = Object.keys(this.modules);
      console.log('modulekey', this.moduleKeys);
      for (let i = 0; i < this.moduleKeys.length; i++) {
        if (i === 3) {
          continue;
        }
        this.fetchAllUserGroups();

        function fetchAllUserGroups(moduleKey) {
          // Now you can use the moduleKey argument in your function logic
          // ...
          this.moduleKeys.push(this.moduleKeys[i]);
        }
      }
    });
  }

  fetchAllUserGroups() {
    this.commonService.presentLoading();
    this.commonService.fetchAllUserGroups().then(
      (resp) => {
        this.allUserGroups = resp;
        console.log('fetchdata', resp);
        // this.getEmployeesByIds(this.allTeams[this.selectedGroup]['users']);
        this.allUserGroups.forEach((group) => {
          console.log('fetchdata', resp);

          if (group && group.modules && Object.keys(group.modules).length == 0)
            group.modules = Object.assign(this.modules);
          if (
            group &&
            group.permissions &&
            Object.keys(group.permissions).length == 0
          )
            group.permissions = Object.assign(this.permissions);
        });
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

  async addUserGroup() {
    const alert = await this.alertController.create({
      header: 'Please enter user group name',
      inputs: [
        {
          name: 'groupName',
          type: 'text',
          placeholder: 'Team name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Add',
          handler: (alertData) => {
            let paramsData = {
              groupName: alertData.groupName,
            };

            if (paramsData.groupName) {
              this.commonService.createUserGroup(paramsData).then(
                (resp) => {
                  this.fetchAllUserGroups();
                  console.log('create team ', resp);
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
            } else {
              this.commonService.showToast('error', 'Please fill all fields');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  selectGroup(i) {
    console.log('selectGroup  ', i);
    this.selectedGroup = i;
  }

  getModuleModel() {}

  updateModules() {
    // console.log("updateUserGroup ", this.allUserGroups[this.selectedGroup])
    this.commonService
      .updateUserGroup(this.allUserGroups[this.selectedGroup])
      .then(
        (resp) => {
          this.fetchAllUserGroups();
          console.log('create team ', resp);
          this.commonService.showToast('success', 'User Group Updated!');
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

  async removeUserGroup(group, index) {
    const alert = await this.alertController.create({
      header: 'Delete User Group ' + group.groupName + '!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.allUserGroups.splice(index, 1);
            this.commonService.deleteUserGroup(group).then((resp) => {
              this.commonService.showToast(
                'success',
                'Removed group ' + group.groupName + '!'
              );
            });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  updatePermissions() {
    // console.log("updateUserGroup ", this.allUserGroups[this.selectedGroup])
    this.commonService
      .updateUserGroup(this.allUserGroups[this.selectedGroup])
      .then(
        (resp) => {
          this.fetchAllUserGroups();
          console.log('create team ', resp);
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
}
