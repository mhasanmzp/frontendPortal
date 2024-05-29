import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { MassUploadPage } from 'src/app/Modal/mass-upload/mass-upload.page';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  [x: string]: any;
  allRequests: any = [];
  allEmployeesReal: any = [];
  attendenceDate: any;
  checkAttendance: any = {};
  attendanceToggle: boolean = false;
  showDeleteButton: boolean = false;
  selectedDate: any;
  allTeam: any;
  selectedTeam: any;
  editTimeInHours: number;
  editindex: number;
  totalHours: number;
  request: any;
  newPunchMinutes: any;

  constructor(
    public modalCtrl: ModalController,
    public authService: AuthService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.fetchEmployee(this.commonService.formatDate(new Date()));
    this.attendenceDate = this.commonService.formatDate(new Date());
    this.fetchAllTeams();
    // let ProductId = this.route.snapshot.paramMap.get('id')
    // console.warn("thankyou",ProductId)
    this.punchIn = localStorage.getItem('punchIn');
    // this.punchIn = parseFloat(localStorage.getItem('punchIn'));
    console.log('d', this.punchIn);
  }
  async showModal() {
    // const modal = await this.modalCtrl.create({
    //   component: MassUploadPage,
    //   componentProps : {payload : '/massUploadMaterial',name : 'Upload Attendence'},
    //   cssClass: 'my-custom-modal-css'
    // });
    // return await modal.present();
  }
  getDate(ev) {
    console.log(ev.target.value);
    this.selectedDate = ev.target.value;
    this.fetchEmployee(ev.target.value);
  }
  toggleAllAttendance() {
    this.attendanceToggle = !this.attendanceToggle;
    console.log('toggle ', this.attendanceToggle);
    let keys = Object.keys(this.checkAttendance);
    if (this.attendanceToggle) {
      this.showDeleteButton = true;
      keys.forEach((key) => {
        this.checkAttendance[key] = true;
      });
    } else {
      this.showDeleteButton = false;
      keys.forEach((key) => {
        this.checkAttendance[key] = false;
      });
    }
  }
  toggleOneAttendance(i) {
    let keys = Object.keys(this.checkAttendance);
    this.showDeleteButton;
    this.showDeleteButton = false;
    keys.forEach((key) => {
      if (this.checkAttendance[key]) this.showDeleteButton = true;
    });
  }
  ////Fetch Employees who are on boarding
  fetchEmployee(date) {
    this.commonService.presentLoading();

    let formData = {
      organisationId: localStorage.getItem('organisationId'),
      date,
      // punchIn: localStorage.getItem("punchIn")
    };
    this.commonService.getEmployeeAttendence(formData).then((resp: any) => {
      console.log('resp', resp);

      //
      let newEmployeeList = resp.map((element) => {
        date = new Date(element.punchIn);
        var newHours = date.getHours();
        var ampm = newHours >= 12 ? 'PM' : 'AM';
        // var ampm = newHours.split(':')[0]>=12?'PM':'AM'
        var newMinutes = date.getMinutes();

        if (newHours < 10) {
          newHours = '0' + newHours;
        }

        if (newMinutes < 10) {
          newMinutes = '0' + newMinutes;
        }

        element.punchIn = newHours + ':' + newMinutes + " " + ampm;
        // return element;

        if (element.punchOut == null) {
          return element.punchout
        } else {
          var punchoutdate = new Date(element.punchOut);
          var newPunchHours: any = punchoutdate.getHours();
          var punchampm = newPunchHours >= 12 ? 'PM' : 'AM';
          var newPunchMinutes: any = punchoutdate.getMinutes();
          element.punchOut =
            newPunchHours + ':' + newPunchMinutes;


          if (newPunchHours < 10) {
            newPunchHours = 0 + newPunchHours;
          } else
            // Add leading zero to minutes if needed
            if (newPunchMinutes < 10) {
              let number = 0;
              newPunchMinutes = `${number}${newPunchMinutes}`;
            }
          element.punchOut =
            newPunchHours + ':' + newPunchMinutes + " " + punchampm;
        }
        return element;
      });
      console.log(newEmployeeList);

      this.allRequests = resp;
      this.allEmployeesReal = resp;
      this.allRequests.forEach((r, i) => {
        this.checkAttendance[i] = false;
        this.items = this.allRequests;
      });
      // this.items = Array.from(this.allRequests);
      // this.toggleAllAttendance();
      // console.log("response from getEmployee",this.allRequests)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    }
    );
  }
  searchEmployee(event) {
    console.log('event ', event.target.value);
    let searchTerm = event.target.value;
    let emp;
    emp = this.allEmployeesReal.filter((e) =>
      e.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (emp.length > 0) {
      this.allRequests = emp;
    }
  }
  downloadAttendance() {
    console.log('this.attendenceDate ', this.attendenceDate);
    let url =
      this.authService.apiUrl +
      'employeesAttendanceDownload?date=' +
      this.commonService.formatDate(this.attendenceDate);
    window.open(url, '_blank');
  }
  userAttendance(userdata) {
    // debugger;
    console.log(userdata);
    const attendanceData = localStorage.getItem('attendanceData');
    localStorage.setItem('attendanceData', JSON.stringify(userdata));
    this.router.navigate([
      'attendance/user-attendance',
      { id: userdata.employeeId },
    ]);
  }
  fetchAllTeams() {
    this.commonService.fetchAllTeams().then((resp) => {
      console.log(resp);
      this.allTeam = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    });
  }
  searchTeam(event) {
    this.selectedTeam = event.target.value;
    console.log(this.selectedTeam);
    if (this.selectedTeam == 'search') {
      this.allRequests = this.allEmployeesReal;
    } else {
      this.allTeam.forEach((element) => {
        if (element.teamId == this.selectedTeam) {
          this.allRequests = [];
          this.allEmployeesReal.forEach((ele) => {
            if (element.users.includes(ele.employeeId)) {
              this.allRequests.push(ele);
            }
          });
        }
      });
    }
  }
  onEdit(item: any) {
    // debugger;
    item.isEdit = true;
    this.editindex = item;

  }
  onUpdate(item: any) {
    const punchInMilliseconds = this.timeToMilliseconds(item.punchIn);
    const punchOutMilliseconds = this.timeToMilliseconds(item.punchOut);

    const totalWorkingHours = this.calculateTotalWorkingHours(
      punchInMilliseconds,
      punchOutMilliseconds,
      item.punchIn,
      item.punchOut
    );


    const payload = {
      punchIn: punchInMilliseconds,
      punchOut: punchOutMilliseconds,
      employeeId: item.employeeId,
      date: item.date,
      hours: parseFloat(totalWorkingHours),
    };


    // Reset totalHours to zero
    this.totalHours = 0;

    this.commonService
      .updateEmployeeAttendance(payload)
      .then((resp: any) => {
        this.commonService.showToast('success', 'Data updated!');
        localStorage.setItem('punchIn', item.punchIn);
        localStorage.setItem('punchOut', item.punchOut);
        item.isEdit = false;
        // Update total hours
        this.fetchEmployee(this.attendenceDate);
        this.updateTotalHours();
      })
      .catch((error: any) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      });

  }



  calculateTotalWorkingHours(a: number, b: number, timeStringA: string, timeStringB: string): string {
    const periodA = timeStringA.split(' ')[1];
    const periodB = timeStringB.split(' ')[1];

    const millisecondsWorked = b - a;
    let hoursWorked = millisecondsWorked / (1000 * 60 * 60);

    if (periodA === 'PM' && periodB === 'AM') {
      hoursWorked += 24; // Add 24 hours to cover the overnight period
    }

    return hoursWorked.toFixed(2); // Return the total working hours rounded to two decimal places
  }


  updateTotalHours() {
    this.totalHours = this.allRequests.reduce((total, request) => {
      const punchInMilliseconds = this.timeToMilliseconds(request.punchIn);
      const punchOutMilliseconds = this.timeToMilliseconds(request.punchOut);
      const requestHours =
        Math.abs(punchOutMilliseconds - punchInMilliseconds) / (1000 * 60 * 60); // Use Math.abs() to get the absolute value
      return total + requestHours;
    }, 0);
  }

  timeToMilliseconds(timeString: string): number {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    const timeDate = moment({
      hour: period === 'AM' ? hours : hours % 12 + 12,
      minute: minutes,
      second: 0,
      millisecond: 0,
    });

    return timeDate.valueOf();
  }
  oncancel(obj: any) {
    obj.isEdit = false;
  }
}
