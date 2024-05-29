import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EmployeeProfilePage } from './pages/employee-profile/employee-profile.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  allTicketData: any;
  user: any = {};
  public modules: any = [];
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
      title: 'Appraisal',
      url: 'appraisal-hr-screen',
      icon: 'trending-up',
      permission: 'Performance',
    },
    {
      title:'My Appraisal',
      url: 'employee-evaluation',
      icon:'people',
      permission: 'Performance',
    },
    {
      title:'Manager',
      url: 'manager',
      icon:'people',

      permission: 'Performance',
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
      title: 'My Attendance',
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
      title: 'Holidays Calendar',
      url: 'holidays',
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
      icon: 'ticket',
      permission: 'Tickets',
    },
    {
      title: 'User Groups',
      url: 'user-groups',
      icon: 'albums',
      permission: 'UserGroups',
    },
    {
      title: 'Conveyance/Allowance',
      url: 'conveyance',
      icon: 'wallet',
      permission: 'Leaves',
    },
    {
      title: 'Lead Generate',
      url: 'leadgenerate',
      icon: 'wallet',
      permission: 'Leaves',
    },
    {
      title: 'Fixed Asset Tracking',
      url: 'asset',
      icon: 'grid',
      permission: 'Leaves',
    },



    // {
    //   title: 'Teams',
    //   url: 'teams',
    //   icon: 'people-circle',
    //   permission: 'Teams',
    // },
    // {
    //   title: 'My Leaves',
    //   url: 'leaves',
    //   icon: 'calendar',
    //   permission: 'Leaves',
    // },
    // {
    //   title: 'View All Leaves',
    //   url: 'view-all-leave',
    //   icon: 'calendar',
    //   permission: 'ViewAllLeave',
    // },
    // {
    //   title: 'View All Logs',
    //   url: 'view-log',
    //   icon: 'document',
    //   permission: 'ViewAllLog',
    // },
    // {
    //   title: 'Leave Report',
    //   url: 'all-user-leave-admin',
    //   icon: 'calendar',
    //   permission: 'LeaveReport',
    // },
    // {
    //   title: 'Expenses',
    //   url: 'expenses',
    //   icon: 'cash',
    //   permission: 'Expenses',
    // },
    // {
    //   title: 'ATS/CV Pool',
    //   url: 'ats',
    //   icon: 'file-tray-full',
    //   permission: 'ATSCVPool',
    // },
    // {
    //   title: 'Inventory',
    //   url: 'inventory',
    //   icon: 'information-circle',
    //   permission: 'Inventory',
    // },
    // {
    //   title: 'Grievance',
    //   url: 'tickets',
    //   icon: 'information-circle',
    //   permission: 'Tickets',
    // },
    // {
    //   title: 'User Groups',
    //   url: 'user-groups',
    //   icon: 'albums',
    //   permission: 'UserGroups',
    // },

    // { title: 'View All KRA', url: 'view-all-kra', icon: 'eye', permission: 'ViewAllKRA'},
    // { title: 'Profile', url: 'profile', icon: 'person' },
    // { title: 'Settings', url: 'settings', icon: 'settings' },
  ];
  public salesPages = [
    { title: 'Customers', url: 'sales/customers' },
    // { title: 'Invoices', url: 'employee-list' },

    // { title: 'Payments Received', url: 'attendance' }
  ];
  public PMO = [
    { title: 'Monthly Costing', url: 'pmo/monthlyconsting' },
    { title: 'Capacity', url: 'pmo/capacity' },
    // { title: 'Invoices', url: 'employee-list' },

    // { title: 'Payments Received', url: 'attendance' }
  ];

  salesPermission: boolean = false;
  constructor(
    public commonService: CommonService,
    public modalController: ModalController,
    public menuController: MenuController,
    public router: Router,
    public authService: AuthService
  ) {
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.getAllTicketData();
      this.getTicketData();
    }

    // client-side
    //   console.log("connect socket"); // x8WIv7-mJelg7on_ALbx
    // this.socket.on("connect", () => {
    //   console.log("connect ", this.socket.id); // x8WIv7-mJelg7on_ALbx
    //   this.socket.emit('new message', "test");
    // });

    //     this.socket.on('new message', (message: string) => {
    //       console.log('Received new message:', message);
    //       // this.messages.push(message);
    //     });

    let type = localStorage.getItem('type');
    if (!type) localStorage.setItem('type', 'employee');
    this.menuController.enable(false);
    if (userId) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let url = event.url.split('/')[1];
          console.log('url------', url);
          // this.commonService.currentUrl = this.appPages.filter(el=>el.url == url)[0]['permission']
          // console.log("url------",this.commonService.currentUrl)
          if (event.url == '/') {
            this.router.navigate(['/dashboard']);
          }
        }
      });
      this.setupPermissions(userId);
    } else {
      this.router.navigate(['/login']);
    }

    this.authService.userLogin.subscribe((resp: any) => {
      console.log('authService userLogin', resp);
      if (resp && resp.userId) {
        this.setupPermissions(resp.userId);
      }
    });
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) =>
      toggleDarkTheme(mediaQuery.matches)
    );

    // Add or remove the "dark" class based on if the media query matches
    function toggleDarkTheme(shouldAdd) {
      // console.log(" toggleDarkTheme", shouldAdd);
      document.body.classList.toggle('dark', shouldAdd);
    }
  }

  setupPermissions(userId) {
    let type = localStorage.getItem('type');
    console.log(' type ', type);
    console.log(' setupPermissions userId ', userId);
    this.authService.getUserDetails(userId, type).then((data: any) => {
      if (data) {
        this.user = data;
        console.log(' getUserDetails ', data);
        this.modules = [];
        if (type == 'customer') {
          this.router.navigate(['/client-dashboard']);
        } else {
          let permissions = data['modules'];
          if (permissions) {
            this.appPages.forEach((module) => {
              if (permissions[module.permission]) this.modules.push(module);
            });
            if (permissions['Sales']) this.salesPermission = true;
          } else {
            this.modules = this.appPages;
          }
          // this.modules = this.appPages
          console.log('router.url ', this.router.url);
          if (this.router.url == '/login') this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  async openProfile() {
    const popover = await this.modalController.create({
      component: EmployeeProfilePage,
      cssClass: 'profile-modal',
      // componentProps: {test: "123"},
      showBackdrop: true,
    });
    await popover.present();
  }

  openChat() {
    this.router.navigate(['/chatrooms']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
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
          this.allTicketData = res.filter((item: any) => {
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
