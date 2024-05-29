import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, IonInput, MenuController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  error: any;
  form: any;
  errorMessage: any;
  userId: any;
  segment: any = 'teams';
  working: any = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  }
  boardName: any;
  teamName: any;
  allTeams: any = []
  allUsers: any = []
  managers: any = []
  boardColumns: any = []
  selectedTeam: any = 0;
  overlayRef: OverlayRef;
  isOpen = false;
  changeText = false;
  managersToggle: any = {};
  keepOn: any = {};

  constructor(
    public fb: FormBuilder, public alertController: AlertController, public commonService: CommonService,
    public overlay: Overlay, public menuController: MenuController, public platform: Platform,
    public authService: AuthService, public router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      organisationName: ['', Validators.required],
      // organisationCode: ['', Validators.required],
      organisationGST: ['', Validators.required],
      organisationPAN: ['', Validators.required],
      organisationEmail: ['', Validators.required],
      organisationBranch: ['', Validators.required],
      organisationPhone: ['', Validators.required],
      organisationAddress: ['', Validators.required],
      NumberofEmployee: ['', Validators.required],
      // email: ['', Validators.required],
      // pwd: ['', Validators.required],
    });
    this.fetchAllTeams();
  }

  fetchAllTeams() {
    this.commonService.presentLoading();
    this.commonService.fetchAllTeams().then(resp => {
      this.allTeams = resp;
      this.getEmployeesByIds(this.allTeams[this.selectedTeam]['users']);
      this.allTeams.forEach((team, m) => {
        this.managersToggle[m] = {};
        this.keepOn[m] = {};
        this.fetchTeamColumns(team);
        this.commonService.getEmployeesByIds(team.managers).then(managersData => {
          team.managersData = managersData;
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
      })
      console.log("this.managersToggle ", this.managersToggle)
    })
  }

  delayMouseOverToggle(managersToggle, i, m) {
    // setTimeout(() => {
    this.keepOn[i][m] = false;
    let iKeys = Object.keys(managersToggle);
    iKeys.forEach(ikey => {
      let mKeys = Object.keys(managersToggle[ikey]);
      mKeys.forEach((mkey: any) => {
        mkey = false;
      })
    })
    // console.log("managersToggle ",managersToggle)
    // console.log("this.keepOn ",this.keepOn)
    // if(!this.keepOn[i][m])
    managersToggle[i][m] = true;
    // }, 500);
  }

  delayMouseOutToggle(managersToggle, i, m) {
    // console.log("delayMouseOutToggle ")
    setTimeout(() => {
      // console.log("managersToggle ",managersToggle)
      // console.log("this.keepOn ",this.keepOn)
      if (!this.keepOn[i][m])
        managersToggle[i][m] = false;
    }, 200);
  }

  closePopover(managersToggle, i, m) {
    // console.log("closePopover ")
    // console.log("this.keepOn[i][m]  ", this.keepOn[i][m])
    this.keepOn[i][m] = false;
    managersToggle[i][m] = false;
  }

  fetchTeamColumns(team) {
    this.commonService.fetchTeamColumns(team.teamId).then(resp => {
      team.teamBoardColumns = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getEmployeesByIds(employeeIds) {
    console.log("employeeIds  ", employeeIds)
    this.commonService.getEmployeesByIds(employeeIds).then(resp => {
      this.allUsers = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getTeamManagers(team) {
    this.commonService.getEmployeesByIds(team.managers).then(resp => {
      team.managersData = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  selectTeam(index) {
    this.selectedTeam = index;
    let team = this.allTeams[this.selectedTeam];
    this.allUsers = [];
    this.getEmployeesByIds(team.users)
  }

  searchEmployee(ev) {
    if ((ev.target.value).length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(resp => {
        console.log("searchEmployee  ", resp)
        this.allUsers = resp;
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    } else {
      this.getEmployeesByIds(this.allTeams[this.selectedTeam]['users']);
    }
  }

  searchManagers(ev) {
    if ((ev.target.value).length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(resp => {
        this.managers = resp;
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }

  addEmployeeTeam(user) {
    console.log("user  ", user)
    let team = this.allTeams[this.selectedTeam];
    console.log("team  ", team)
    team.users.push(user.employeeId);
    this.commonService.updateTeam(team);
  }

  removeEmployeeTeam(user) {
    let team = this.allTeams[this.selectedTeam];
    let index = team.users.indexOf(user.employeeId)
    team.users.splice(index, 1)
    this.commonService.updateTeam(team);
  }

  checkInTeam(user) {
    let team = this.allTeams[this.selectedTeam];
    if (team && team.users && team.users.indexOf(user.employeeId) > -1)
      return false
    else
      return true
  }

  checkInTeamManagers(user) {
    let team = this.allTeams[this.selectedTeam];
    if (team && team.managers && team.managers.indexOf(user.employeeId) > -1)
      return false
    else
      return true
  }

  async addTeam() {
    const alert = await this.alertController.create({
      header: 'Please enter team name',
      inputs: [
        {
          name: 'teamName',
          type: 'text',
          placeholder: 'Team name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Add',
          handler: (alertData) => {
            if (alertData.teamName) {
              this.allTeams.push({ teamName: alertData.teamName })
              this.commonService.createTeam({ teamName: alertData.teamName }).then(resp => {
                this.fetchAllTeams();
                console.log("create team ", resp)
              }, error => {
                this.commonService.showToast('error', error.error.msg);
                if (error.error.statusCode == 401) {
                  localStorage.clear();
                  sessionStorage.clear();
                  this.router.navigateByUrl('/login')
                }
              })
            }
            else {
              this.commonService.showToast('error', 'Please fill all fields')
            }

          }
        }
      ]
    });
    await alert.present();
  }

  addManager(team, user) {
    team.managers.push(user.employeeId)
    this.getTeamManagers(team);
    this.commonService.updateTeam(team);
  }

  removeTeamManager(team, manager) {
    console.log("removeTeamManager")
    let index = team.managers.indexOf(manager.employeeId)
    team.managersData.splice(index, 1)
    team.managers.splice(index, 1)
    this.commonService.updateTeam(team);
  }

  async removeTeam(team, index) {
    const alert = await this.alertController.create({
      header: 'Delete Team ' + team.teamName + '!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.allTeams.splice(index, 1);
            this.commonService.deleteTeam(team).then(resp => {
              this.commonService.showToast("success", "Removed team " + team.teamName + "!")
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

    const { role } = await alert.onDidDismiss();
  }

  async addNewBoard() {
    const alert = await this.alertController.create({
      header: 'Please enter board column name',
      inputs: [
        {
          name: 'input',
          type: 'text',
          placeholder: 'Column name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Add',
          handler: (alertData) => {
            let columnName = alertData.input
            // console.log(columnName);
            // console.log("selected team ", this.allTeams[this.selectedTeam]);
            let newColumn = {
              teamId: this.allTeams[this.selectedTeam].teamId,
              columnName: columnName
            }
            console.log("newColumn ", newColumn);
            if (newColumn.columnName) {
              this.commonService.createTeamColumn(newColumn).then(resp => {
                this.fetchTeamColumns(this.allTeams[this.selectedTeam])
                console.log("createTeamColumn ", resp);
              }, error => {
                this.commonService.showToast('error', error.error.msg);
                if (error.error.statusCode == 401) {
                  localStorage.clear();
                  sessionStorage.clear();
                  this.router.navigateByUrl('/login')
                }
              })
            }
            else {
              this.commonService.showToast('error', 'Please fill all fields')
            }

          }
        }
      ]
    });
    await alert.present();

  }

  async deleteTeamColumn(column) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete it.',
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
            this.commonService.deleteTeamColumn(column.columnId).then(resp => {
              this.fetchTeamColumns(this.allTeams[this.selectedTeam])
              console.log("createTeamColumn ", resp);
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

  submitBoard() {
    console.log("wwww", this.boardName);
  }

}

function test() {
  console.log("wwww test");
}