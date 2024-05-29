import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  customers: any = [];

  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.commonService.fetchCustomers().then((resp: any) => {
      console.log(resp);
      this.customers = resp
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  editDetails(data) {
    this.router.navigateByUrl('/customers-details', { state: { customerDetail: data } })
  }

}
