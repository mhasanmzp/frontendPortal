
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
  customers: any = [];
allRequest:any=[];
  userId: any;
  teamsId:any=[];
  usacalender:any=[
    {
      "Date": "1st -Jan-25",
      "Event": "Holiday",
      "Day_of_the_week": "Wednesday", 
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "01-Jan-24",
      "Event": "New Year`s Day",
      "Day_of_the_week": "Monday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "15-Jan-24",
      "Event": "Martin Luther King's Day",
      "Day_of_the_week": "Monday",
      "Holiday": "Working day",
      "Remarks": "NTT and other will be working so it's working day, if they are not working it will be Holiday"
    },
    {
      "Date": "26-Jan-24",
      "Event": "Republic Day (India)",
      "Day_of_the_week": "Friday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "25-Mar-24",
      "Event": "Holi",
      "Day_of_the_week": "Monday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "01-May-24",
      "Event": "Labour Day (India)",
      "Day_of_the_week": "Wednesday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "27-May-24",
      "Event": "Memorial Day",
      "Day_of_the_week": "Monday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "4-Jul-23",
      "Event": "Independence Day",
      "Day_of_the_week": "Thursday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "15-Aug-24",
      "Event": "Independence Day (India)",
      "Day_of_the_week": "Thursday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "15-Aug-24",
      "Event": "Independence Day (India)",
      "Day_of_the_week": "Thursday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "2-Sep-24",
      "Event": "Labour Day",
      "Day_of_the_week": "Monday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "02-Oct-24",
      "Event": "Gandhi Jayanti",
      "Day_of_the_week": "Wednesday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "14-Oct-24",
      "Event": "Columbus Day",
      "Day_of_the_week": "Monday",
      "Holiday": "Working day",
      "Remarks": "NTT and other will be working so it's working day, if they are not working it will be Holiday"
    },
    {
      "Date": "20 -Oct-24/21 Oct 24",
      "Event": "Karva Chauth",
      "Day_of_the_week": "Sunday/Monday",
      "Holiday": "WFH",
      "Remarks": "WFH"
    },
    {
      "Date": "10-Nov-23",
      "Event": "Veterans Day (observed)",
      "Day_of_the_week": "Friday",
      "Holiday": "Working day",
      "Remarks": "NTT and other will be working so it's working day, if they are not working it will be Holiday"
    },
    {
      "Date": "11-Nov-24",
      "Event": "Veterans Day",
      "Day_of_the_week": "Monday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "28-Nov-24",
      "Event": "Thanksgiving Day",
      "Day_of_the_week": "Thursday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "29-Nov-24",
      "Event": "Black Friday",
      "Day_of_the_week": "Friday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    },
    {
      "Date": "25-Dec-24",
      "Event": "Christmas Day",
      "Day_of_the_week": "Wednesday",
      "Holiday": "OFF",
      "Remarks": "Holiday"
    }
  ]
  ukcalender:any=[
    {
      "Date": "01-Jan-24",
      "Event": "New Year`s Day",
      "Day": "Monday",
      "Holiday": "All Teams"
    },
    {
      "Date": "26-Jan-24",
      "Event": "Republic Day (India)",
      "Day": "Friday",
      "Holiday": "Holiday"
    },
    {
      "Date": "25-Mar-24",
      "Event": "Holi",
      "Day": "Monday",
      "Holiday": "Development/Marketing/Neuvays OFF"
    },
    {
      "Date": "29-Mar-24",
      "Event": "Good Friday",
      "Day": "Friday",
      "Holiday": "Development/Marketing/Neuvays OFF"
    },
    {
      "Date": "8-April-24",
      "Event": "Eid",
      "Day": "Monday",
      "Holiday": "Recruitment(WFH),Development/Marketing/Neuvays(OFF)"
    },
    {
      "Date": "01-May-24",
      "Event": "Labour Day (India)",
      "Day": "Wednesday",
      "Holiday": "All Teams"
    },
    {
      "Date": "19-Aug-24",
      "Event": "Rakshabandhan",
      "Day": "Monday",
      "Holiday": "OFF"
    },
    {
      "Date": "15-Aug-24",
      "Event": "Independence Day (India)",
      "Day": "Thursday",
      "Holiday": "Off"
    },
    {
      "Date": "26-Aug-24",
      "Event": "Janmashtami",
      "Day": "Monday",
      "Holiday": "Development/Marketing/Neuvays(OFF)"
    },
    {
      "Date": "25-Dec-24",
      "Event": "Christmas Day",
      "Day": "Wednesday",
      "Holiday": "All Teams"
    },
    {
      "Date": "20 -Oct-24/21 Oct 24",
      "Event": "Karva Chauth",
      "Day": "Sunday/Monday",
      "Holiday": "Full day Remote"
    },
    {
      "Date": "29-Oct-24",
      "Event": "Diwali",
      "Day": "Wednesday",
      "Holiday": "Development/Marketing/Neuvays"
    },
    {
      "Date": "3 -Nov-24",
      "Event": "Bhai Duj",
      "Day": "Sunday",
      "Holiday": "Development/Marketing/Neuvays(WFH)"
    },
    {
      "Date": "25-Dec-24",
      "Event": "Christmas Day",
      "Day": "Wednesday",
      "Holiday": "All Teams"
    },
    {
      "Date": "1st -Jan-25",
      "Event": "Holiday",
      "Day": "Wednesday",
      "Holiday": "Holiday"
    }
  ]
  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    // this.teamId();
    // this.holidaysData();
  }

 
 teamId() {
  this.commonService.presentLoading();
  let form={
    "employeeId": this.userId,
    "permissionName": "Dashboard",
    "employeeIdMiddleware": this.userId
  }
  // console.log('team id response', form); 
  this.commonService.getTeamId(form).then((res: any) => {
    this.teamsId=res;
    this.holidaysData();
    console.log('teams id response', res); 
    console.log('teams id response', this.teamsId); 
  }, error => {
    this.commonService.showToast('error', error.error.msg);
  })
}

holidaysData(){
 
this.commonService.presentLoading();
let form= {
  "teamId": this.teamsId,
  "permissionName": "Dashboard",
  "employeeIdMiddleware": this.userId
}

  // console.log('team id response', form); 
  this.commonService.getHoliDays(form).then((res: any) => {
    console.log('holidays', res); 
    this.allRequest=res;
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
