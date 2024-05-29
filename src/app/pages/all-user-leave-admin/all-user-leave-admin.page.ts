import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-all-user-leave-admin',
  templateUrl: './all-user-leave-admin.page.html',
  styleUrls: ['./all-user-leave-admin.page.scss'],
  
})
export class AllUserLeaveAdminPage implements OnInit {

  getUserLeave: any[] = [];
  filteredUserLeave: any[] = [];
  searchTerm: string = '';
  selectedEmployeeId: any;
  editIndex: number;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.commonService.presentLoading();
    const year = 2023;
    const payload = { year: year };

    this.commonService.userAdmin(payload).then(
      (res: any) => {
        console.log('User Admin Response:', res);
        this.getUserLeave = res;
        
        this.filteredUserLeave = res; // Initialize filteredUserLeave with all data
      },
      (error) => {
        console.error('User Admin Error:', error);
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode === 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  onEdit(emp: any) {
    emp.isEdit = true;
    this.editIndex = emp;
  }

  onCancel(emp: any) {
    emp.isEdit = false;
    this.editIndex = undefined; // Reset the editIndex
  }
  

  

  onUpdate(emp: any) {
    const formData = {
      employeeId: emp.employeeId,
      year: 2023,
      paid_leaves: parseFloat(emp.paid_leaves),
      sick_leaves: parseFloat(emp.sick_leaves),
      wfh: parseFloat(emp.wfh),
      month: 9,
    };

    console.log('Update Data:', formData);

    this.commonService.updateleaveAdmin(formData).then(
      (res: any) => {
        if (res) {
          this.fetchData();
          this.commonService.showToast('success',"Update succesFully");
        } else {
          console.error('Update Failed: Something went wrong');
        }
      },
      (error) => {
        console.error('Update Error:', error);
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode === 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  onSearch() {
    // Implement custom filtering logic based on the searchTerm
    this.filteredUserLeave = this.getUserLeave.filter((emp) =>
      emp.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
