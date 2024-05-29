
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-monthlyconsting',
  templateUrl: './monthlyconsting.page.html',
  styleUrls: ['./monthlyconsting.page.scss'],
})
export class MonthlyconstingPage implements OnInit {
  customers: any = [];
  timeframe: any = 'month'
  department: any = 'all';
  dropDownData: any;

  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit() {
   
  }

  selectionChanged(ev: any) {
    this.dropDownData = ev.detail
    console.log("data of dropdown list", this.dropDownData)
  }
  editDetails(data) {
   
    alert("edit popup");
  }

}
