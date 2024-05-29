import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-createform',
  templateUrl: './createform.page.html',
  styleUrls: ['./createform.page.scss'],
})
export class CreateformPage implements OnInit {
  ratingsForm: FormGroup;
  ratingData: any;
  detail: any;
  entries: any[] = [];
  totalSum = 0;
  appraisalInfo: any = {};
  appraisalId: string;
  employeeName: string;
  designation: string;
  userId: any = localStorage.getItem('userId');

  constructor(
    private formBuilder: FormBuilder,
    private reviewservice: ReviewService,
    private http: HttpClient,
    private commonService: CommonService,
    private toast: ToastController,
    private route: ActivatedRoute
  ) {
    this.ratingsForm = this.formBuilder.group({
      employeeName: [''],
      appraisalId: [''],
      email: [''],
      designation: [''],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.appraisalId = params.appraisalId;
      this.employeeName = params.employeeName;
      this.designation = params.designation;
    });

    this.ratingsForm = this.formBuilder.group({
      communicationexcellent: false,
      communicationverygood: false,
      communicationgood: false,
      communicationaverage: false,
      communicationremarks: false,
      interpersonalexcellent: false,
      interpersonalverygood: false,
      interpersonalgood: false,
      interpersonalaverage: false,
      interpersonalremarks: false,
      abilityexcellent: false,
      abilityverygood: false,
      abilitygood: false,
      abilityaverage: false,
      abilityremarks: false,
      solvingexcellent: false,
      solvingverygood: false,
      solvinggood: false,
      solvingaverage: false,
      solvingremarks: false,
      flexibilityexcellent: false,
      flexibilityverygood: false,
      flexibilitygood: false,
      flexibilityaverage: false,
      flexibilityremarks: false,
      willingnessexcellent: false,
      willingnessverygood: false,
      willingnessgood: false,
      willingnessaverage: false,
      willingnessremarks: false,
      perfectexcellent: false,
      perfectverygood: false,
      perfectgood: false,
      perfectaverage: false,
      perfectremarks: false,
      habitsexcellent: false,
      habitsgood: false,
      habitsverygood: false,
      habitsaverage: false,
      habitsremarks: false,
      presentationexcellent: false,
      presentationgood: false,
      presentationverygood: false,
      presentationaverage: false,
      presentationremarks: false,
      punctualityexcellent: false,
      punctualitygood: false,
      punctualityverygood: false,
      punctualityaverage: false,
      punctualityremarks: false,
      inexcellent: false,
      ingood: false,
      inverygood: false,
      inaverage: false,
      inremarks: false,
      wiexcellent: false,
      wigood: false,
      wiverygood: false,
      wiaverage: false,
      wiremarks: false,
      teamexcellent: false,
      teamgood: false,
      teamverygood: false,
      teamaverage: false,
      teamremarks: false,
      colleaguesexcellent: false,
      colleaguesgood: false,
      colleaguesverygood: false,
      colleaguesaverage: false,
      colleaguesremarks: false,
      makingexcellent: false,
      makinggood: false,
      makingverygood: false,
      makingaverage: false,
      makingremarks: false,
      skexcellent: false,
      skgood: false,
      skverygood: false,
      skaverage: false,
      skremarks: false,
    });
  }

  onsubmit() {
    const formValues = this.ratingsForm.value;
    const userId = +localStorage.getItem('userId');
    const payload = {
      appraisalId: this.appraisalId,
      employeeId: userId,
      employeeIdMiddleware: userId,
      permissionName: 'Tasks',
      sum: this.totalSum,
      communicationSkill: formValues.communicationexcellent ? '5' :
                          formValues.communicationverygood ? '4' :
                          formValues.communicationgood ? '3' :
                          formValues.communicationaverage ? '2': '',
      communicationSkillRemarks: formValues.communicationremarks,
      interpersonalSkill: formValues.interpersonalexcellent ? '5' :
                          formValues.interpersonalverygood ? '4' :
                          formValues.interpersonalgood ? '3' :
                          formValues.interpersonalaverage ? '2': '',
    interpersonalSkillRemarks: formValues.interpersonalremarks,
    abilityToPlanTheWork:  formValues.abilityexcellent ? '5' :
                          formValues.abilityverygood ? '4' :
                          formValues.abilitygood ? '3' :
                          formValues.abilityaverage ? '2': '',
   abilityToPlanTheWorkRemarks:formValues.abilityremarks,
   problemSolving:            formValues.solvingexcellent ? '5' :
                              formValues.solvingverygood ? '4' :
                              formValues.solvinggood ? '3' :
                              formValues.solvingaverage ? '2': '',
    problemSolvingRemarks:    formValues.solvingremarks ,
    adaptability:             formValues.flexibilityexcellent ? '5' :
                              formValues.flexibilityverygood ? '4' :
                              formValues.flexibilitygood ? '3' :
                              formValues.flexibilityaverage ? '2': '',
  adaptabilityRemarks:        formValues.flexibilityremarks ,
  willingnessToShoulderAdditional:  formValues.willingnessexcellent ? '5' :
                              formValues.willingnessverygood ? '4' :
                            formValues.willingnessgood ? '3' :
                            formValues.willingnessaverage ? '2': '',
   willingnessToShoulderAdditionalRemarks: formValues.willingnessremarks,
    commitmentToDoAPerfectJob: formValues.perfectexcellent ? '5' :
                              formValues.perfectverygood ? '4' :
                              formValues.perfectgood ? '3' :
                              formValues.perfectaverage ? '2': '',
    commitmentToDoAPerfectJobRemarks:formValues.perfectremarks,
    habitsAndManners: formValues.habitsexcellent ? '5' :
                              formValues.habitsverygood ? '4' :
                              formValues.habitsgood ? '3' :
                              formValues.habitsaverage ? '2': '',
    habitsAndMannersRemarks:formValues.habitsremarks,
    presentation: formValues.presentationexcellent ? '5' :
                              formValues.presentationverygood ? '4' :
                              formValues.presentationgood ? '3' :
                              formValues.presentationaverage ? '2': '',
    presentationRemarks:formValues.presentationremarks,
    punctuality: formValues.punctualityexcellent ? '5' :
                              formValues.punctualityverygood ? '4' :
                              formValues.punctualitygood ? '3' :
                              formValues.punctualityaverage ? '2': '',
    punctualityRemarks:formValues.punctualityremarks,
    confidentialityOfInfo: formValues.inexcellent ? '5' :
                              formValues.inverygood ? '4' :
                              formValues.ingood ? '3' :
                              formValues.inaverage ? '2': '',
    confidentialityOfInfoRemarks:formValues.inremarks,
    trustworthiness: formValues.wiexcellent ? '5' :
                              formValues.wiverygood ? '4' :
                              formValues.wigood ? '3' :
                              formValues.wiaverage ? '2': '',
    trustworthinessRemarks:formValues.wiremarks,
   teamSpirit: formValues.teamexcellent ? '5' :
                              formValues.teamverygood ? '4' :
                              formValues.teamgood ? '3' :
                              formValues.teamaverage ? '2': '',
   teamSpiritRemarks:formValues.teamremarks,
   relationshipWithColleagues: formValues.colleaguesexcellent ? '5' :
                              formValues.colleaguesverygood ? '4' :
                              formValues.colleaguesgood ? '3' :
                              formValues.colleaguesaverage ? '2': '',
   relationshipWithColleaguesRemarks:formValues.colleaguesremarks,
    decisionMaking: formValues.makingexcellent ? '5' :
                              formValues.makingverygood ? '4' :
                              formValues.makinggood ? '3' :
                              formValues.makingaverage ? '2': '',
   decisionMakingRemarks: formValues.makingremarks,
   computerskills: formValues.skexcellent ? '5' :
                              formValues.skverygood ? '4' :
                              formValues.skgood ? '3' :
                              formValues.skaverage ? '2': '',
    computerskillsRemarks:formValues.skremarks,

    };

    this.reviewservice.submitRatings(payload)
      .then(
        (res: any) => {
          console.log('response', res);
        },
        (error) => {
          this.commonService.presentToast('error', error.error.msg);
        }
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
  // total sum of ratings
  handleCheckboxChange(controlName: string, event: any, skillGroup: string) {
    const checked = event.detail.checked;
    let numericValue = null;
    const rowControls = ['excellent', 'verygood', 'good', 'average'];

    if (checked) {
      // Uncheck other checkboxes in the same row
      rowControls.forEach((rowControl) => {
        if (rowControl !== controlName) {
          this.ratingsForm.get(`${skillGroup}${rowControl}`)?.setValue(false);
        }
      });
      if (checked) {
        switch (controlName) {
          case 'excellent':
            numericValue = 5;
            this.ratingsForm.get('excellent')?.setValue(true);
            break;
          case 'verygood':
            numericValue = 4;
            this.ratingsForm.get('verygood')?.setValue(true);
            break;
          case 'good':
            numericValue = 3;
            this.ratingsForm.get('good')?.setValue(true);
            break;
          case 'average':
            numericValue = 2;
            this.ratingsForm.get('average')?.setValue(true);
            break;
        }
      } else {
        numericValue = null;
      }

      // Update the total sum
      if (checked) {
        this.totalSum += numericValue;
        console.log(`Numeric value for ${controlName}: ${numericValue}`);
        console.log(`Total sum: ${this.totalSum}`);
      } else {
        this.totalSum -= numericValue;
        console.log(`Numeric value for ${controlName}: ${-numericValue}`);
        console.log(`Total sum: ${this.totalSum}`);
      }
    }
    // handleRemarksChange(skillGroup: string, event: any) {
    //   const remarks = event.detail.value;
    //   console.log(`Remarks for : ${remarks}`);

    // }
  }

  handleRemarksChange(skill: string, event: any) {
    const remarks = event.target.value;
    console.log(`Remarks for ${skill}: ${remarks}`);
    // You can also update your form control with the new remarks value if needed
  }
}
