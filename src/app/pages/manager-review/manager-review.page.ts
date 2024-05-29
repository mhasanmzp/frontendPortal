import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-manager-review',
  templateUrl: './manager-review.page.html',
  styleUrls: ['./manager-review.page.scss'],
})
export class ManagerReviewPage implements OnInit {

  employeeForm: FormGroup;
  name: any;
  designation: any;
  appraisalId: string;
  detail: any=[];
  totalSum: any = 0;


  userId: any=localStorage.getItem('userId');
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private toast: ToastController,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    // Initialize the form with form controls
    this.employeeForm = this.formBuilder.group({
      designation: ['', Validators.required],
      division: ['', Validators.required],
      careerLevel: ['', Validators.required],
      managerName: ['', Validators.required],
      name: ['', Validators.required],
      joiningDate: ['', Validators.required],
      department: ['', Validators.required],
      reviewPeriod: ['', Validators.required],
      evaluationPurpose: ['', Validators.required],
      overallScore: ['', Validators.required],
    });
    this.route.queryParams.subscribe(params => {
      this.appraisalId = params.appraisalId;

    });
    // this.route.params.subscribe(params => {
    //   this.employeeName = params.employeeName;
    //   this.designation = params.designation;
    //   this.appraisalId = params.appraisalId;


    //   this.employeeForm.patchValue({
    //     employeeName: this.employeeName,
    //     designation: this.designation,
    //   });
    // });
    this.fetchemployeedetails(this.appraisalId);
  }

  fetchemployeedetails(appraisalId: any) {
    // Assuming this method is called with an appraisalId
    this.appraisalId = appraisalId;
    let formData = {
      employeeId: this.userId,
      employeeIdMiddleware: this.userId,
      permissionName: 'Tasks',
      empId: this.userId,
      appraisalId: appraisalId
    };

    this.reviewService.fetchemployeedetails(formData).then(
      (response: any) => {
        console.log(response);
        this.detail = response; // Assuming response is an object
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  onsubmitform() {
    console.log('Appraisal ID:', this.appraisalId);
    this.reviewService
      .fetchmanagerReview({
        appraisalId: this.appraisalId,
        employeeId: this.userId,
        employeeIdMiddleware: this.userId,
        permissionName: 'Tasks',
        sum: this.totalSum,

      })
      .then(
        (response: any) => {
          console.log('response', response);
          this.detail = response;
        },
      );
    this.presentToast();
  }



  async presentToast() {
    const toast = await this.toast.create({
      message: 'Submitted successfully!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }

  updateTotalSum(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = parseFloat(inputElement.value);
    if (!isNaN(numericValue)) {
      this.totalSum += numericValue;
      console.log(`Total sum: ${this.totalSum}`);
    } else {
      console.error('Invalid numeric value:', numericValue);
    }
  }
}







