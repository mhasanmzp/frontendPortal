import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-all-kra',
  templateUrl: './view-all-kra.page.html',
  styleUrls: ['./view-all-kra.page.scss'],
})
export class ViewAllKraPage implements OnInit {

  years: any = [];
  month: any = 1;
  year: any;
  selectedTeam: any;
  months: any = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  teams: any = [
    {teamName:'Parul',teamId:1},
    {teamName:'Sonali',teamId:2},
    {teamName:'Vikash',teamId:3},
    {teamName:'Vishal',teamId:4},
    {teamName:'Faisal',teamId:5},
  ];

  constructor(private commonService:CommonService) { }

  ngOnInit() {
    let date = new Date();
    this.month = date.getMonth() + 1;
    let year = date.getFullYear();
    for (let i = 0; i < 10; i++)
      this.years.push(year - i);
    this.year = year;

    
  }

  teamChanged(event:any){}

  checkStatus(dsr, date) {
    // let fDate = this.year + '-' + this.addLeadingZeros(this.month, 2) + '-' + this.addLeadingZeros(date, 2);
    // let filtered = dsr.result.filter(r => r.date == fDate);
    // if (filtered && filtered[0] && filtered[0].dsrStatus == 'Completed')
    //   return 1;
    // else if (filtered && filtered[0] && filtered[0].dsrStatus == 'In-Complete')
    //   return 2;
    // else
      return 0
  }
}
