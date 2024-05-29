import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validator } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ReviewService } from 'src/app/services/review.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reviewform',
  templateUrl: './reviewform.page.html',
  styleUrls: ['./reviewform.page.scss'],
})
export class ReviewformPage implements OnInit {

  reviewForm: FormGroup;
  detail: any=[];
  totalSum = 0;
  appraisalId: string;
  employeeName: string; // Assuming employeeName is a string
  designation: string;
  skills: [''];


  userId: any=localStorage.getItem('userId');

  constructor(private formBuilder: FormBuilder,
     private navCtrl: NavController,
     private route: ActivatedRoute,
     private commonService: CommonService,
     private toast: ToastController,
     private reviewservice: ReviewService) {
    this.reviewForm = this.formBuilder.group({
      communicationRating: [''],
      interpersonalRating: [''],
      abilityRating: [''],
      solvingRating: [''],
      flexibilityRating: [''],
      willingnessRating: [''],
      perfectRating: [''],
      habitsRating: [''],
      presentationRating: [''],
      punctualityRating: [''],
      inRating: [''],
      wiRating: [''],
      teamRating: [''],
      colleaguesRating: [''],
      makingRating: [''],
      skRating: [''],
    });
    this.appraisalId = 'your-appraisal-id';
  }

  ngOnInit() {
    this.ionViewWillEnter();
   }
   ionViewWillEnter() {
     this.appraisalId = this.route.snapshot.params.id;
     this.fetchRating(this.appraisalId);
   }

   getLabelForValue(value: number): string {
    switch (value) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Very Good';
      case 3:
        return 'Good';
      case 2:
        return 'Average';
      default:
        return '';
    }
  }

   managerReview(appraisalId: string) {
    this.navCtrl.navigateForward(`/manager-review/${appraisalId}`);
  }
  handleDropdownChange(event: any, category: string) {
    this.reviewForm.get(category + 'Rating').setValue(event.detail.value);
    const ratingValues = {
      excellent: 5,
      verygood: 4,
      good: 3,
      average: 2
    };
    const selectedValue = event.detail.value;
    const numericValue = ratingValues[selectedValue];

    // Update the total sum
    if (selectedValue) {
      this.totalSum += numericValue;
      console.log(`Numeric value for ${category}: ${numericValue}`);
      console.log(`Total sum: ${this.totalSum}`);
     } else {
            this.totalSum -= numericValue;
            console.log(`Numeric value for ${category}: ${-numericValue}`);
            console.log(`Total sum: ${this.totalSum}`);
          }
  }
  fetchRating(appraisalId: any) {
    this.appraisalId = appraisalId;
    let formData = {
      employeeId: this.userId,
      employeeIdMiddleware: this.userId,
      permissionName: 'Tasks',
      appraisalId: appraisalId,
    };
    console.log('rating', formData);
    this.reviewservice.fetchRating(formData).then(
      (response: any) => {
        console.log(response);
        this.detail = []; // Clear the array before adding new entries
        this.detail.push(response);
        console.log('ttttttttt', this.detail);
      },
      (error) => {
        console.error('Error fetching appraisal info:', error);
      }
    );
  }

  onsubmitRating(){
    const userId = +localStorage.getItem('userId');
    this.reviewservice
      .fetchmanagerRating({
        appraisalId: this.appraisalId,
        employeeId: this.userId,
        employeeIdMiddleware: this.userId,
        permissionName: 'Tasks',
        sum: this.totalSum,

      })
      .then(
        (res: any) => {
          console.log('response', res);

        },
      );
      this.presentToast();
  }

  // logEntries(){
  //   console.log(this.detail);
  // }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Submitted successfully!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }

}


