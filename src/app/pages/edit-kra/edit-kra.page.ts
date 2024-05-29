import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-kra',
  templateUrl: './edit-kra.page.html',
  styleUrls: ['./edit-kra.page.scss'],
})
export class EditKraPage implements OnInit {
  kraDetails: any;
  flag: any;
  KAR_header = [
    { title: 'Designation', index: 'Designation' },
    { title: 'Division', index: 'Division' },
    { title: 'Career Level', index: 'CarrierLevel' },
    { title: 'Manager Name', index: 'ManagerName' },
    { title: 'Employee Name', index: 'EmployeeName' },
    { title: 'Joining Date', index: 'JoiningDate' },
    { title: 'Department', index: 'Department' },
    { title: 'Review Period(in Days)', index: 'ReviewPeriod' },
    { title: 'Evaluation Purpose', index: 'EvaluationPurpose' }
  ];
  KRA_Rating = [
    { title: 'KRA Score', required: true },
    { title: 'Taget Score', required: false },
    { title: 'KPI Score', required: false },
    { title: 'Actual Score', required: false },
    { title: 'Final Rating', required: false }
  ];
  evaluaterName: any;
  directorName: any;
  recommendation: any;
  comment: any;
  skill = 'TECHNICAL SKILLS';
  designation: any = [];
  totalScore: any;
  kraForm = {} as FormGroup;
  kraAdministratForm = {} as FormGroup;
  kraManagerialForm = {} as FormGroup;
  kraAllProgressForm = {} as FormGroup;
  kraScoringForm = {} as FormGroup;
  public tasks: FormArray;
  public administratTasks: FormArray;
  public managerialTasks: FormArray;
  public allProgressTasks: FormArray;
  public scoringTasks: FormArray;
  month: any;
  technicalRating: any = 0;
  administratRating: any = 0;
  managerialRating: any = 0;
  allProgressRating: any = 0;
  scoringRating: any = 0;
  year: any;
  kraKeyValue: any = [];
  managerReviewForm: FormGroup;
  managerReviewOption: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private commonService: CommonService, private router: Router) {
    this.kraForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
    this.kraAdministratForm = this.fb.group({
      administratTasks: this.fb.array([this.createAdministratTask()])
    });
    this.kraManagerialForm = this.fb.group({
      managerialTasks: this.fb.array([this.createManagerialTask()])
    });
    this.kraAllProgressForm = this.fb.group({
      allProgressTasks: this.fb.array([this.createAllProgressTask()])
    });
    this.kraScoringForm = this.fb.group({
      scoringTasks: this.fb.array([this.createScoringTask()])
    });
  }

  ngOnInit() {
    this.detailsKRA();
    this.reviewForm();
  }

  createTask(): FormGroup {
    return this.fb.group({
      kra: [''],
      kraScore: [''],
      tScore: [''],
      kpiScore: [''],
      aScore: [''],
      fRating: [''],
      review: [''],
    });
  }
  get employees(): FormArray {
    return this.kraForm.get('tasks') as FormArray;
  }
  get kraGroups() { return this.employees.controls as FormGroup[]; }

  addSkill() {
    this.tasks = this.kraForm.get('tasks') as FormArray;
    this.tasks.push(this.createTask());
    this.TechnicalRating('');
  }
  removeSkill(i: any) {
    if (this.tasks.length > 1) {
      this.tasks.removeAt(i);
    } else {
      // this.myservice.toastError("You can't delete less than 1 task")
    }
    this.TechnicalRating('');
  }
  TechnicalRating(event) {
    if (this.tasks) {
      console.log(this.tasks?.value);
      this.technicalRating = 0;
      this.tasks?.value.forEach(element => {
        this.technicalRating += (+element.kraScore)
      });
    } else {
      console.log(event.target.value)
      this.technicalRating = event.target.value
    }
    if (this.technicalRating > 100) {
      this.commonService.showToast("error", "Technical rating must be 100")
    }
  }

  /**  ****** Administrat Skill ******** */
  createAdministratTask(): FormGroup {
    return this.fb.group({
      kraAdministrat: [''],
      kraScoreAdministrat: [''],
      tScoreAdministrat: [''],
      kpiScoreAdministrat: [''],
      aScoreAdministrat: [''],
      fRatingAdministrat: [''],
      reviewAdministrat: [''],
    });
  }
  get administratEmployees(): FormArray {
    return this.kraAdministratForm.get('administratTasks') as FormArray;
  }
  get kraAdministratGroups() { return this.administratEmployees.controls as FormGroup[]; }
  addAdministratSkill() {
    this.administratTasks = this.kraAdministratForm.get('administratTasks') as FormArray;
    this.administratTasks.push(this.createAdministratTask());
    this.AdministratRating('');
  }
  removeAdministratSkill(i: any) {
    if (this.administratTasks.length > 1) {
      this.administratTasks.removeAt(i);
    } else {
      // this.myservice.toastError("You can't delete less than 1 task")
    }
    this.AdministratRating('');
  }
  AdministratRating(event) {
    if (this.administratTasks) {
      console.log(this.administratTasks?.value);
      this.administratRating = 0;
      this.administratTasks?.value.forEach(element => {
        this.administratRating += (+element.kraScoreAdministrat)
      });
    } else {
      this.administratRating = event.target.value
    }
    if (this.administratRating > 100) {
      this.commonService.showToast("error", "Administration rating must be 100")
    }
  }

  /** ********** Managerial Skill ********** */
  createManagerialTask(): FormGroup {
    return this.fb.group({
      kraManagerial: [''],
      kraScoreManagerial: [''],
      tScoreManagerial: [''],
      kpiScoreManagerial: [''],
      aScoreManagerial: [''],
      fRatingManagerial: [''],
      reviewManagerial: [''],
    });
  }
  get managerialEmployees(): FormArray {
    return this.kraManagerialForm.get('managerialTasks') as FormArray;
  }
  get kraManagerialGroups() { return this.managerialEmployees.controls as FormGroup[]; }
  addManagerialSkill() {
    this.managerialTasks = this.kraManagerialForm.get('managerialTasks') as FormArray;
    this.managerialTasks.push(this.createManagerialTask());
    this.ManagerialRating('');
  }
  removeManagerialSkill(i: any) {
    if (this.managerialTasks.length > 1) {
      this.managerialTasks.removeAt(i);
    } else {
      // this.myservice.toastError("You can't delete less than 1 task")
    }
    this.ManagerialRating('');
  }
  ManagerialRating(event) {
    if (this.managerialTasks) {
      console.log(this.managerialTasks?.value);
      this.managerialRating = 0;
      this.managerialTasks?.value.forEach(element => {
        this.managerialRating += (+element.kraScoreManagerial)
      });
    } else {
      this.managerialRating = event.target.value
    }
    if (this.managerialRating > 100) {
      this.commonService.showToast("error", "Managerial rating must be 100")
    }
  }

  /**  ********* All Progress ********** */
  createAllProgressTask(): FormGroup {
    return this.fb.group({
      kraAllProgress: [''],
      kraScoreAllProgress: [''],
      tScoreAllProgress: [''],
      kpiScoreAllProgress: [''],
      aScoreAllProgress: [''],
      fRatingAllProgress: [''],
      reviewAllProgress: [''],
    });
  }
  get allProgressEmployees(): FormArray {
    return this.kraAllProgressForm.get('allProgressTasks') as FormArray;
  }
  get kraAllProgressGroups() { return this.allProgressEmployees.controls as FormGroup[]; }
  addAllProgressSkill() {
    this.allProgressTasks = this.kraAllProgressForm.get('allProgressTasks') as FormArray;
    this.allProgressTasks.push(this.createAllProgressTask());
    this.AllProgressRating('');
  }
  removeAllProgressSkill(i: any) {
    if (this.allProgressTasks.length > 1) {
      this.allProgressTasks.removeAt(i);
    } else {
      // this.myservice.toastError("You can't delete less than 1 task")
    }
    this.AllProgressRating('');
  }
  AllProgressRating(event) {
    if (this.allProgressTasks) {
      console.log(this.allProgressTasks?.value);
      this.allProgressRating = 0;
      this.allProgressTasks?.value.forEach(element => {
        this.allProgressRating += (+element.kraScoreAllProgress)
      });
    } else {
      this.allProgressRating = event.target.value
    }
    if (this.allProgressRating > 100) {
      this.commonService.showToast("error", "All-progress rating must be 100")
    }
  }

  /** ******* Scoring System ********** */
  createScoringTask(): FormGroup {
    return this.fb.group({
      attribute: [''],
      score: [''],
    });
  }
  get scoringEmployees(): FormArray {
    return this.kraScoringForm.get('scoringTasks') as FormArray;
  }
  get kraScoringGroups() { return this.scoringEmployees.controls as FormGroup[]; }
  addScoringSkill() {
    this.scoringTasks = this.kraScoringForm.get('scoringTasks') as FormArray;
    this.scoringTasks.push(this.createScoringTask());
    this.ScoringRating('');
  }
  removeScoringSkill(i: any) {
    if (this.scoringTasks.length > 1) {
      this.scoringTasks.removeAt(i);
    } else {
      // this.myservice.toastError("You can't delete less than 1 task")
    }
    this.ScoringRating('');
  }
  ScoringRating(event) {
    if (this.scoringTasks) {
      console.log(this.scoringTasks?.value);
      this.scoringRating = 0;
      this.scoringTasks?.value.forEach(element => {
        this.scoringRating += (+element.score)
      });
    } else {
      this.scoringRating = event.target.value
    }
    if (this.scoringRating > 10) {
      this.commonService.showToast("error", "Score rating must be 10")
    }
  }


  detailsKRA() {
    this.kraDetails = JSON.parse(localStorage.getItem('kraDetails'));
    this.flag = localStorage.getItem('kraFlag');
    console.log(this.kraDetails, this.flag);
    if (this.flag == 'updatePerform') {
      this.getKraManager();
    }

    if (this.kraDetails && this.flag == 'update') {
      this.employees.removeAt(0);
      this.administratEmployees.removeAt(0);
      this.managerialEmployees.removeAt(0);
      this.allProgressEmployees.removeAt(0);
      this.scoringEmployees.removeAt(0);
      this.totalScore = this.kraDetails.TotalScore;
      this.designation.Designation = this.kraDetails.Designation;
      this.designation.Division = this.kraDetails.Designation;
      this.designation.CarrierLevel = this.kraDetails.CarrierLevel;
      this.designation.ManagerName = this.kraDetails.ManagerName;
      this.designation.EmployeeName = this.kraDetails.employeeName;
      this.designation.JoiningDate = this.kraDetails.JoiningDate.slice(0, 10);
      this.designation.Department = this.kraDetails.Department;
      this.designation.ReviewPeriod = this.kraDetails.ReviewPeriod;
      this.designation.EvaluationPurpose = this.kraDetails.EvaluationPurpose;
      this.recommendation = this.kraDetails.Recommendation;
      this.comment = this.kraDetails.Comment;
      this.evaluaterName = this.kraDetails.ManagerName;
      this.directorName = this.kraDetails.DirectorName;
      this.month = this.kraDetails.month;
      this.year = this.kraDetails.year;

      for (let i = 0; i < this.kraDetails.TechnicalSkill.length; i++) {
        const form = this.fb.group({
          kra: this.kraDetails.TechnicalSkill[i].kra,
          kraScore: this.kraDetails.TechnicalSkill[i].kraScore,
          tScore: this.kraDetails.TechnicalSkill[i].tScore,
          kpiScore: this.kraDetails.TechnicalSkill[i].kpiScore,
          aScore: this.kraDetails.TechnicalSkill[i].aScore,
          fRating: this.kraDetails.TechnicalSkill[i].fRating,
          review: this.kraDetails.TechnicalSkill[i].review,
        });
        this.employees.push(form);
        this.technicalRating += (+this.kraDetails.TechnicalSkill[i].kraScore)
      }

      for (let i = 0; i < this.kraDetails.AdministrationSkill.length; i++) {
        const form = this.fb.group({
          kraAdministrat: this.kraDetails.AdministrationSkill[i].kraAdministrat,
          kraScoreAdministrat: this.kraDetails.AdministrationSkill[i].kraScoreAdministrat,
          tScoreAdministrat: this.kraDetails.AdministrationSkill[i].tScoreAdministrat,
          kpiScoreAdministrat: this.kraDetails.AdministrationSkill[i].kpiScoreAdministrat,
          aScoreAdministrat: this.kraDetails.AdministrationSkill[i].aScoreAdministrat,
          fRatingAdministrat: this.kraDetails.AdministrationSkill[i].fRatingAdministrat,
          reviewAdministrat: this.kraDetails.AdministrationSkill[i].reviewAdministrat,
        });
        this.administratEmployees.push(form);
        this.administratRating += (+this.kraDetails.AdministrationSkill[i].kraScoreAdministrat)
      }

      for (let i = 0; i < this.kraDetails.ManagerialSkill.length; i++) {
        const form = this.fb.group({
          kraManagerial: this.kraDetails.ManagerialSkill[i].kraManagerial,
          kraScoreManagerial: this.kraDetails.ManagerialSkill[i].kraScoreManagerial,
          tScoreManagerial: this.kraDetails.ManagerialSkill[i].tScoreManagerial,
          kpiScoreManagerial: this.kraDetails.ManagerialSkill[i].kpiScoreManagerial,
          aScoreManagerial: this.kraDetails.ManagerialSkill[i].aScoreManagerial,
          fRatingManagerial: this.kraDetails.ManagerialSkill[i].fRatingManagerial,
          reviewManagerial: this.kraDetails.ManagerialSkill[i].reviewManagerial,
        });
        this.managerialEmployees.push(form);
        this.managerialRating += (+this.kraDetails.ManagerialSkill[i].kraScoreManagerial)
      }

      for (let i = 0; i < this.kraDetails.AllProgress.length; i++) {
        const form = this.fb.group({
          kraAllProgress: this.kraDetails.AllProgress[i].kraAllProgress,
          kraScoreAllProgress: this.kraDetails.AllProgress[i].kraScoreAllProgress,
          tScoreAllProgress: this.kraDetails.AllProgress[i].tScoreAllProgress,
          kpiScoreAllProgress: this.kraDetails.AllProgress[i].kpiScoreAllProgress,
          aScoreAllProgress: this.kraDetails.AllProgress[i].aScoreAllProgress,
          fRatingAllProgress: this.kraDetails.AllProgress[i].fRatingAllProgress,
          reviewAllProgress: this.kraDetails.AllProgress[i].reviewAllProgress,
        });
        this.allProgressEmployees.push(form)
        this.allProgressRating += (+this.kraDetails.AllProgress[i].kraScoreAllProgress)
      }

      for (let i = 0; i < this.kraDetails.ScoringSystem.length; i++) {
        const form = this.fb.group({
          attribute: this.kraDetails.ScoringSystem[i].attribute,
          score: this.kraDetails.ScoringSystem[i].score,
        });
        this.scoringEmployees.push(form);
        this.scoringRating += (+this.kraDetails.ScoringSystem[i].score)
      }
    }

  }

  updateKRA() {
    if (this.technicalRating == 100 && this.administratRating == 100 && this.managerialRating == 100 && this.allProgressRating == 100) {
      let form = {
        kraId: this.kraDetails.kraId,
        employeeId: this.kraDetails.employeeId,
        organisationId: this.kraDetails.organisationId,
        TotalScore: this.totalScore,
        Designation: this.designation.Designation,
        Division: this.designation.Division,
        CarrierLevel: this.designation.CarrierLevel,
        ManagerName: this.designation.ManagerName,
        employeeName: this.designation.EmployeeName,
        JoiningDate: this.designation.JoiningDate,
        Department: this.designation.Department,
        ReviewPeriod: +this.designation.ReviewPeriod,
        EvaluationPurpose: this.designation.EvaluationPurpose,
        TechnicalSkill: this.kraForm.value.tasks,
        AdministrationSkill: this.kraAdministratForm.value.administratTasks,
        ManagerialSkill: this.kraManagerialForm.value.managerialTasks,
        AllProgress: this.kraAllProgressForm.value.allProgressTasks,
        ScoringSystem: this.kraScoringForm.value.scoringTasks,
        Recommendation: this.recommendation,
        Comment: this.comment,
        EvaluatorName: this.evaluaterName,
        DirectorName: this.directorName,
        month: this.month
      }
      console.log(form);
      this.commonService.updateKRA(form).then((res: any) => {
        console.log(res)
        if (res.msg) {
          this.commonService.showToast('success', 'Update Successfull!');
          if (this.flag == 'updatePerform') {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.router.navigateByUrl('/performance');
          }

        }
      }, error => {
        this.commonService.showToast("error", "Something went wrong!")
      })
    } else {
      this.commonService.showToast("error", "KRA score of each skill will be 100")
    }

  }

  getKraManager() {
    let form = {
      "employeeId": this.kraDetails.employeeId,
      "kraId": this.kraDetails.kraId
    }
    this.commonService.getParticularUserKra(form).then((res: any) => {
      console.log(res);
      if (res) {
        this.kraDetails = res[0];
        this.displayDetailsInList();
      }
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  displayDetailsInList() {
    let keys = Object.keys(this.kraDetails)
    let values = Object.values(this.kraDetails)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "kraId" || keys[i] === "createdAt" || keys[i] === "updatedAt" || keys[i] === "employeeId" || keys[i] === "organisationId") { }
      else if (keys[i] === "AdministrationSkill" || keys[i] === "TechnicalSkill" || keys[i] === "ManagerialSkill" || keys[i] === "AllProgress" || keys[i] === "ScoringSystem") {
      }
      else {
        this.kraKeyValue.push({ 'keys': keys[i], 'values': values[i] })
      }
    }

    for (let i = 0; i < this.kraDetails.TechnicalSkill.length; i++) {
      this.technicalRating += (+this.kraDetails.TechnicalSkill[i].kraScore)
    }

    for (let i = 0; i < this.kraDetails.AdministrationSkill.length; i++) {
      this.administratRating += (+this.kraDetails.AdministrationSkill[i].kraScoreAdministrat)
    }

    for (let i = 0; i < this.kraDetails.ManagerialSkill.length; i++) {
      this.managerialRating += (+this.kraDetails.ManagerialSkill[i].kraScoreManagerial)
    }

    for (let i = 0; i < this.kraDetails.AllProgress.length; i++) {
      this.allProgressRating += (+this.kraDetails.AllProgress[i].kraScoreAllProgress)
    }

    for (let i = 0; i < this.kraDetails.ScoringSystem.length; i++) {
      this.scoringRating += (+this.kraDetails.ScoringSystem[i].score)
    }
  }

  reviewForm() {
    this.managerReviewForm = this.fb.group({
      technicalReview: ['', Validators.required],
      administrationReview: ['', Validators.required],
      managerialReview: ['', Validators.required],
      allProgressReview: ['', Validators.required],
      scoringReview: ['', Validators.required],
      comments: ['', Validators.required]
    })
  }

  displayReviewOption() {
    this.managerReviewOption = !this.managerReviewOption
  }

  submitReview() {
    this.managerReviewForm.value.employeeId = this.kraDetails.employeeId;
    this.managerReviewForm.value.kraId = this.kraDetails.kraId;
    this.managerReviewForm.value.organisationId = this.kraDetails.organisationId;
    if (this.managerReviewForm.value.scoringReview > 10) {
      this.commonService.showToast('error', "Scoring system review is out of 10")
    } else if (this.managerReviewForm.value.technicalReview > 100 || this.managerReviewForm.value.administrationReview > 100 || this.managerReviewForm.value.managerialReview > 100 || this.managerReviewForm.value.allProgressReview > 100) {
      this.commonService.showToast('error', "All skill review is out of 100")
    } else {
      console.log(this.managerReviewForm.value);
      this.commonService.kraManagerRating(this.managerReviewForm.value).then((res: any) => {
        console.log(res)
        if (res.code == 1) {
          this.commonService.showToast('success', res.msg)
          this.getKraManager()
        }
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
}
