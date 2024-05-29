import {
  Component,
  ViewChild,
  Renderer2,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  Inject,
} from '@angular/core';
import {
  IonTextarea,
  PopoverController,
  ModalController,
} from '@ionic/angular';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FeedbackPage } from '../../pages/feedback/feedback.page';
import { NewPostPage } from '../../pages/new-post/new-post.page';
import { createAnimation, Animation } from '@ionic/core';
import { DashboardService } from '../../services/dashboard.service';
import { AlertController } from '@ionic/angular';
import { NotificationsPage } from '../notifications/notifications.page';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { EChartsOption } from 'echarts';
import { TasksService } from 'src/app/services/tasks.service';
import { DOCUMENT } from '@angular/common';
import * as XLSX from 'xlsx';

// declare var Peer:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardPage implements OnInit {
  notifications: any = 0;
  allTicketData: any;

  daysInWeek: any = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  taskDate: any;
  segment: any = 'home';
  subSegment: any = 'projectList';
  isReportingManager: any = 0;
  posts: any = [];
  getNearbyPosts: boolean = false;
  checkedNearbyPosts: boolean = false;
  allProjects: any = [];
  newsFeed: any = [];
  today: any;
  attendanceData: any;
  quote: any = {};
  // allTeams: any = [];
  name = [
    { employeeName: 'Aniket' },
    { employeeName: 'Sonali' },
    { employeeName: 'Parul' },
    { employeeName: 'Vikash' },
    { employeeName: 'Faisal' },
  ];
  project = [
    { projectName: 'Hr Portal', progress: 0.3, teamName: 'Development Team' },
    { projectName: 'The Meet', progress: 0.8, teamName: 'Sales Team' },
  ];
  permissionViewAllDSR: boolean = false;
  isOpen: boolean = false;
  notification: any = [];
  employeeId: any;
  allTasks: any = [];
  testingTasks: any = [];
  responseLength: any;
  notificationItems: any = [];
  peer: any;
  conn: any;
  projectMembers: any = [];
  teamBoardColumns: any;
  connectedTo: any = [];
  raisedTicket: any;
  raisedTicketManager: any;
  windowHeight: any = 0;
  windowHeight1: any = 0;
  ticketExtraHours: any = 0;
  previousDays: any = [];
  selectedWeek: any = [];
  teams: any = [];
  teamEmployees: any = [];
  selectedTeam: any;
  selectAllCheckBox: any;
  checkBoxes: HTMLCollection | any;
  customAlertOptions: any = {
    header: 'Select Team',
    subHeader: 'Select All:',
    message: `<ion-checkbox id="selectAllCheckBox"></ion-checkbox>`,
  };
  weeklySummary: any = [];
  weeklySummaryHeader: any = [];

  constructor(
    public authService: AuthService,
    public projectService: ProjectService,
    public commonService: CommonService,
    public dashboardService: DashboardService,
    public modalController: ModalController,
    private taskService: TasksService,
    public router: Router,
    private alertController: AlertController,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    // this.commonService.notificationUpdated.subscribe(res => {
    //   let n = localStorage.getItem('n');
    //   if(n){
    //     this.notifications = JSON.parse(n).length;
    //   }
    // })
    this.getAllTicketData();
    this.getTicketData();

  }

  ngOnInit() {
    this.previousDays = this.LastNWeek();
    this.previousDays[2].selected = true;
    this.selectedWeek = this.previousDays[2];

    this.windowHeight = window.innerHeight - 90 + 'px';
    this.windowHeight1 = window.innerHeight - 190 + 'px';
    this.today = new Date();
    this.taskDate = this.commonService.formatDate(new Date());

    this.authService.getRandomQuote().then((resp) => {
      this.quote = resp;
    });

    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.permissionViewAllDSR = resp.permissions.ViewAllDSR;
        localStorage.setItem(
          'employeeName',
          resp.firstName + ' ' + resp?.lastName
        );
        this.employeeId = resp.employeeId;
        this.getAllProjects();
        this.projectService.getTeamsReporting().then((resp: any) => {
          this.isReportingManager = resp.length;
          console.log('reporting', this.isReportingManager);
        });
        this.getAllPost();
        this.fetchAllTeams();
        this.getTasksAssigned();
        this.getAttendanceData();
        this.getUserTicket();
        // this.getNotification();
      }
    });

    this.authService.getNewsFeed().then((resp) => {
      this.newsFeed = resp;
    });
  }

  ionViewWillEnter() {
    this.segment='home'

    this.getUserTicket();
    this.getAllProjects();
    this.fetchAllTeams();
  }

  getAttendanceData() {
    let formData = {
      organisationId: localStorage.getItem('organisationId'),
      date: this.commonService.formatDate(new Date()),
    };
    this.commonService.getEmployeeAttendence(formData).then(
      (resp: any) => {
        this.attendanceData = resp.filter(
          (r) => r.employeeId == this.authService.userId
        )[0];
        // this.toggleAllAttendance();
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  getAllPost() {
    this.dashboardService.getAllPost().then(
      (resp) => {
        this.posts = resp;
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  fetchAllTeams() {
    this.commonService.fetchAllTeams().then(
      (resp) => {
        // console.log("teams of weekly",resp)
        this.teams = resp;
        this.teams.forEach((element) => {
          if (element.teamName == 'Development') {
            this.selectedTeam = element.teamId;
            this.teamEmployees = element.users;
          }
        });

        this.getWeeklySummary();
        // this.allTeams = resp;
        // this.getEmployeesByIds(this.allTeams[this.selectedTeam]['users']);
        // this.allTeams.forEach((team, m) => {
        //   this.managersToggle[m] = {};
        //   this.keepOn[m] = {};
        //   this.fetchTeamColumns(team);
        //   this.commonService.getEmployeesByIds(team.managers).then(managersData => {
        //     team.managersData = managersData;
        //   })
        // })
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  openSelector(selector) {
    selector.open().then((alert) => {
      this.selectAllCheckBox =
        this.document.getElementById('selectAllCheckBox');
      this.checkBoxes = this.document.getElementsByClassName('alert-checkbox');
      this.renderer.listen(this.selectAllCheckBox, 'click', () => {
        if (this.selectAllCheckBox.checked) {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute('aria-checked') === 'false') {
              (checkbox as HTMLButtonElement).click();
            }
          }
        } else {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute('aria-checked') === 'true') {
              (checkbox as HTMLButtonElement).click();
            }
          }
        }
      });
      alert.onWillDismiss().then(() => {
        this.teamChanged(this.selectAllCheckBox.checked);
      });
    });
  }

  teamChanged(event) {
    let selectedTeams = this.teams.filter(
      (t) => this.selectedTeam.indexOf(t.teamId) != -1
    );
    let employees = [];
    selectedTeams.forEach((team) => {
      employees = employees.concat(team.users);
    });
    employees = employees.filter((item, index) => {
      return employees.indexOf(item) == index;
    });
    this.teamEmployees = employees;
    this.getWeeklySummary();
  }

  async presentPopover() {
    const popover = await this.modalController.create({
      component: FeedbackPage,
      cssClass: 'setting-modal',
      //    enterAnimation(baseEl) {
      //     const wrapperAnimation = createAnimation()
      //     .beforeStyles({
      //       transform: 'translateY(0) scale(1)'
      //     })
      //     .addElement(baseEl.shadowRoot.querySelector('.modal-wrapper'));

      //   return createAnimation()
      //     .addElement(baseEl)
      //     .duration(250)
      //     .fromTo('opacity', '0', '1')
      //     .addAnimation([wrapperAnimation]);
      // },
      showBackdrop: true,
    });
    await popover.present();
  }

  async createNewPost() {
    const popover = await this.modalController.create({
      component: NewPostPage,
      cssClass: 'setting-modal',
      //    enterAnimation(baseEl) {
      //     const wrapperAnimation = createAnimation()
      //     .beforeStyles({
      //       transform: 'translateY(0) scale(1)'
      //     })
      //     .addElement(baseEl.shadowRoot.querySelector('.modal-wrapper'));

      //   return createAnimation()
      //     .addElement(baseEl)
      //     .duration(250)
      //     .fromTo('opacity', '0', '1')
      //     .addAnimation([wrapperAnimation]);
      // },
      showBackdrop: true,
    });
    popover.onDidDismiss().then((post) => {
      this.posts.unshift(post.data.post);
    });
    await popover.present();
  }

  getDayOfWeek(taskDate) {
    let date = new Date(taskDate);
    let day = date.getDay();
    return this.daysInWeek[day];
  }

  getAllProjects() {
    this.projectService.getMemberProjects().then(
      (resp: any) => {
        this.allProjects = resp;
        this.getManagerTicket();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Tasks on dashboard (Sonali)

  getTasksAssigned() {
    this.commonService
      .getTasksAssigned({ employeeId: this.authService.userId })
      .then(
        (res: any) => {
          this.allTasks = res;
          this.responseLength = res.length;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            this.logout();
          }
        }
      );
    this.getTestingTasksAssigned();
  }

  getTestingTasksAssigned() {
    this.commonService
      .getTestingTasksAssigned({ employeeId: this.authService.userId })
      .then((res: any) => {
        this.testingTasks = res;
      });
  }

  // Notifications on dashboard (Sonali)

  async presentPopoverNotification() {
    const popover = await this.modalController.create({
      component: NotificationsPage,
      cssClass: 'notification-modal',
      showBackdrop: true,
      componentProps: { employeeId: this.employeeId },
    });
    await popover.present();
  }

  openNews(link) {
    window.open(link, '_blank');
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.projectService.updateProjectTask(task).then((resp: any) => {
      this.getTasksAssigned();
    });
  }

  async viewTaskDetails(item, story) {
    this.commonService.presentLoading1();
    this.allProjects.forEach((element) => {
      if (element.projectName.includes(item.projectName)) {
        this.projectService
          .getProjectMembers({ projectId: element.projectId })
          .then(
            (members) => {
              this.projectMembers = members;
              this.projectService
                .getProjectColumns({ projectId: element.projectId })
                .then(async (columns: any) => {
                  columns.forEach((c) => {
                    c.tasks = [];
                    this.connectedTo.push('box' + c.columnId);
                  });
                  this.teamBoardColumns = columns;

                  this.commonService.loadingDismiss1();

                  const popover = await this.modalController.create({
                    component: ProjectTaskDetailsPage,
                    cssClass: 'task-details',
                    componentProps: {
                      item,
                      projectMembers: this.projectMembers,
                      teamBoardColumns: this.teamBoardColumns,
                    },
                    showBackdrop: true,
                  });
                  await popover.present();
                  popover.onDidDismiss().then((resp: any) => {
                    if (resp.data?.status == 1 && story) {
                      story.columnTasks.forEach((element: any, i) => {
                        element.tasks.forEach((task: any) => {
                          if (task.taskId == item.taskId) {
                            story.columnTasks[i].tasks.splice(
                              story.columnTasks[i].tasks.indexOf(item),
                              1
                            );
                          }
                        });
                      });
                      for (let i = 0; i < story.columnTasks.length; i++) {
                        if (story.columnTasks[i].columnId == item.columnId) {
                          story.columnTasks[i].tasks.push(item);
                        }
                      }
                      this.updateTask(item);
                    }
                    if (resp.data?.action == 'update') {
                      this.updateTask(item);
                    } else {
                    }
                  });
                });
            },
            (error) => {
              this.commonService.showToast('error', error.error.msg);
              if (error.error.statusCode == 401) {
                this.logout();
              }
            }
          );
      }
    });
  }

  getUserTicket() {
    this.taskService.getAllTicketsuser({ employeeId: this.employeeId }).then(
      (res: any) => {
        this.raisedTicket = res;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  getManagerTicket() {
    let projectID = [];
    this.allProjects.forEach((element) => {
      projectID.push(element.projectId);
    });

    if (projectID) {
      this.taskService.getAllTicketsManager({ projectId: projectID }).then(
        (res: any) => {
          this.raisedTicketManager = res;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            this.logout();
          }
        }
      );
    }
  }

  approveTicket(data) {
    let form = {
      status: 1,
      requestId: data.requestId,
      taskId: data.taskId,
      extraHours: data.extraHours,
      projectId: data.projectId,
      approvedBy: this.employeeId,
      approverName: localStorage.getItem('employeeName'),
    };
    this.taskService.actionTicketbyManager(form).then(
      (res: any) => {
        this.getManagerTicket();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  LastNWeek() {
    // debugger;
    // var result = [];
    // for (var i = 0; i < 3; i++) {
    //   var curr = new Date();
    //   var first = curr.getDate() - curr.getDay() + 1;
    //   var last = first + 4;
    //   var firstday = new Date(curr.setDate(first - 7 * i));
    //   var lastday = new Date(curr.setDate(last -7 * i));
    //   console.log('succesfully', firstday, lastday);
    //   let date1 = this.formatDate(firstday).split('#');
    //   let date2 = this.formatDate(lastday).split('#');
    //   result.push({
    //     fdate: { date: date1[0], day: date1[1] },
    //     ldate: { date: date2[0], day: date2[1] },
    //   });
    // }
    // result = result.reverse();

    var result = [];
    for (var i = 0; i < 3; i++) {
      var curr = new Date();
      var first = curr.getDate() - curr.getDay() + 1;
      var last = first + 4;
      var firstday = new Date(curr.getTime());
      firstday.setDate(first - 7 * i);
      var lastday = new Date(curr.getTime());
      lastday.setDate(last - 7 * i);
      console.log('successfully', firstday, lastday);
      let date1 = this.formatDate(firstday).split('#');
      let date2 = this.formatDate(lastday).split('#');
      result.push({
        fdate: { date: date1[0], day: date1[1] },
        ldate: { date: date2[0], day: date2[1] },
      });
    }
    result = result.reverse();

    //future week
    let result2 = [];
    for (var i = 2; i >= 1; i--) {
      var curr = new Date();
      var first = curr.getDate() - curr.getDay() + 1;
      var last = first + 4;
      var firstday = new Date(curr.setDate(first + 7 * i));
      var lastday = new Date(curr.setDate(last + 7 * i));
      let date1 = this.formatDate(firstday).split('#');
      let date2 = this.formatDate(lastday).split('#');
      result2.push({
        fdate: { date: date1[0], day: date1[1] },
        ldate: { date: date2[0], day: date2[1] },
      });
    }
    return result.concat(result2.reverse());
  }

  formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = yyyy + '-' + mm + '-' + dd;
    return date + '#' + dd;
  }

  selectBoxWeek(date) {
    this.previousDays.forEach((date) => {
      date.selected = false;
    });
    date.selected = true;
    this.selectedWeek = date;
    this.getWeeklySummary();
  }

  getWeeklySummary() {
    // console.log('this.teamEmployees',this.teamEmployees);
    // console.log('this.selectedWeek',this.selectedWeek);
    let form = {
      startDate: this.selectedWeek.fdate.date,
      endDate: this.selectedWeek.ldate.date,
      employeeId: this.teamEmployees,
    };
    this.dashboardService.weeklySummaryReport(form).then(
      (resp: any) => {
        if (resp.msg) {
          this.commonService.showToast('error', resp.msg);
        } else {
          this.weeklySummary = resp;
        }

        this.weeklySummaryHeader = this.weeklySummary.splice(0, 1);
        // console.log(this.weeklySummaryHeader);
        // console.log(this.weeklySummary)
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  exportexcel() {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Weekly_Utilization.xlsx');
  }

   // ankit code
   getAllTicketData() {
    let userId = +localStorage.getItem('userId');

    this.commonService
      .getAllGrievance({
        employeeId: userId,
        employeeIdMiddleware: userId,
        permissionName: 'Dashboard',
      })
      .then(
        (res: any) => {
          console.table('response', res);

          // filtering all the records with status new
          this.allTicketData = res.filter((item:any) => {
            return item.status == 'New';
          }).length;
          console.log(this.allTicketData);
        },
        (error) => {
          this.commonService.showToast('error', error.error);
        }
      );
  }

  getTicketData() {
    this.commonService.ticket.subscribe((data) => {
      console.log(data);
      this.allTicketData = data;
    });
  }
}
