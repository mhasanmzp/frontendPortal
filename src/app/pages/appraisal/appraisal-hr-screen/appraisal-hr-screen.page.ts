import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AppraisalService } from 'src/app/services/appraisal.service';

@Component({
  selector: 'app-appraisal-hr-screen',
  templateUrl: './appraisal-hr-screen.page.html',
  styleUrls: ['./appraisal-hr-screen.page.scss'],
})
export class AppraisalHrScreenPage implements OnInit {
  data1: any;
  fetch: any;
  fetchEmployee: any;
  employees: any;
  segment: any;
  filterTerm: any;
  departmentName: any;

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public router: Router,
    public appraisalService: AppraisalService
  ) {
    this.data1 = localStorage.getItem('userId');
  }
  ngOnInit() {
    this.fetchDepartment();
    // this.fetchMainScreenList();
  }
  fetchDepartment() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
    };
    this.appraisalService.department(formData).then((data: any) => {
      this.fetch = data;
      // console.log("fetch",data);
    });
  }
  onSelectionChange(data) {
    this.departmentName = data.detail.value;
    this.fetchMainScreenList();
  }

  fetchMainScreenList() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
      name: this.departmentName,
    };
    console.log('mainScreen', formData);
    this.appraisalService.mainScreenList(formData).then((data: any) => {
      this.fetchEmployee = data;
    });
  }
  viewForm() {
    this.router.navigate(['/appraisa-view-scren/']);
  }
  searchEmployee(event: any) {
    const searchTerm: string = event.detail.value;
    console.log('Search Term:', searchTerm);
    if (!searchTerm) {
      this.fetchEmployee = [...this.data1];
      console.log('Data Reset:', this.fetchEmployee);
      return;
    }
    this.fetchEmployee = this.data1.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered Data:', this.fetchEmployee);
  }
  // segmentChanged(ev) {
  //   this.offset = 0;
  //   this.status = ev.target.value;
  //   this.allTickets = [];
  //   if (this.status == 'All') this.status = null;
  //   this.fetchTicket();
  // }
  initiate() {
    this.router.navigate(['/initiate-appraisal']);
  }
  create() {
    this.router.navigate(['/workflow-setup']);
  }
}
