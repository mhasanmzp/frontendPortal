import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
// import 'quill-mention';
// import 'quill-emoji';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  segment: any = 'details';
  employeeId: any;
  projectId: any;
  userGroups: any = [];
  allCustomers: any = [];
  updateFlag: boolean = false;
  basic: FormGroup;
  htmlText = "<p>Testing</p>"
  hasFocus = false;
  subject: string;
  data: any = [
    'India',
    'Sri Lanka'
  ]
  allUsers: any = []
  allProjectMembers: any = [];
  newProject: any = [];
  allEmployees: any = [];

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' }
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ]
  loading: HTMLIonLoadingElement;
  quillConfig = {
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link'],
        // ['link', 'image', 'video']  
      ],

    },
    "emoji-toolbar": false,
    "emoji-textarea": false,
    "emoji-shortname": false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            console.log("enter");
            return true;
          }
        }
      }
    }
  }
  plan: FormGroup;


  constructor(
    public commonService: CommonService,
    public projectService: ProjectService,
    public authService: AuthService,
    public activated: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,

  ) {
    this.basic = this.formBuilder.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      estimatedHours: [''],
      clientName: [''],
      projectStatus: ['', Validators.required],
      customerId: ['', Validators.required],
      projectStage: ['', Validators.required],
      projectType: ['', Validators.required],
      sendDailyStatus: [false, Validators.required],
      sendWeeklyStatus: [false, Validators.required],
      sendMonthlyStatus: [false, Validators.required],
      projectDescription: ['', Validators.required],
      clientEmail: ['', Validators.pattern('[^ @]*@[^ @]*')],
      clientPass: [''],
      architect: ['', Validators.required],
      design: ['', Validators.required],
      dbArchitect: [''],
      backendHrs: ['', Validators.required],
      frontendHrs: ['', Validators.required],
      projectManager: ['', Validators.required],
      serverHrs: ['', Validators.required],
      coordinationHrs: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.projectId = this.activated.snapshot.params.id;
    console.log("projectId", this.projectId)
    if (this.projectId != "null") {
      this.getOneProject();
      this.updateFlag = true;
    } else {
      this.commonService.getEmployeeList().then((resp: any) => {
        this.allEmployees = resp;
      })
    }

    this.commonService.fetchAllUserGroups().then(resp => {
      this.userGroups = resp;
    })

    this.commonService.fetchCustomers().then((resp: any) => {
      this.allCustomers = resp;
      // console.log(resp);
    })



  }

  saveProject() {
    if (this.basic.valid) {
      this.commonService.presentLoading();
      let formData = Object.assign(this.basic.value, { members: this.allProjectMembers })
      this.projectService.createProject(formData).then((resp: any) => {
        this.commonService.loadingDismiss();
        this.segment = 'members';
        this.projectId = resp.projectId;
        this.commonService.showToast("success", "Project Created! Add Members..")
        // this.router.navigate(['/projects']);
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    } else {
      this.commonService.showToast("error", "Fill all required details..")
    }
  }

  updateProject() {
    if (this.basic.valid) {
      this.commonService.presentLoading();
      let formData = Object.assign(this.basic.value, { projectId: this.projectId })
      formData.startDate = this.commonService.formatDate(formData.startDate)
      this.projectService.updateProject(formData).then((resp: any) => {
        this.commonService.loadingDismiss();
        this.commonService.showToast("success", "Project Updated!")
        this.router.navigate(['/projects']);
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

  getProjectMembers() {
    let formData = {
      projectId: this.projectId
    }
    this.projectService.getProjectMembers(formData).then((resp: any) => {
      console.log("getProjectMembers", resp)
      this.allProjectMembers = resp;
      this.allUsers = resp;
    })
  }

  getOneProject() {
    let formData = {
      projectId: this.projectId
    }
    this.getProjectMembers();
    this.commonService.presentLoading();
    this.projectService.getOneProject(formData).then((resp: any) => {
      console.log("getOneProject ", resp)
      this.basic.patchValue(resp);
      this.commonService.loadingDismiss();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  checkInTeam(user) {
    let employee = this.allProjectMembers.filter(r => r.employeeId == user.employeeId)
    if (employee.length > 0)
      return false
    else
      return true
  }

  addEmployeeTeam(user) {
    this.allProjectMembers.push(user);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.addProjectMember(user).then((resp: any) => {
        user.id = resp.id;
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

  removeProjectMember(user) {
    let index = this.allProjectMembers.indexOf(user);
    this.allProjectMembers.splice(index, 1);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.removeProjectMember(user).then(resp => {

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

  searchEmployee(ev) {
    if ((ev.target.value).length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(resp => {
        this.allUsers = resp;
        let fieldData
        for (let i = 0; i < this.allUsers.length; i++) {
          fieldData = this.allProjectMembers.filter(res => res.officialEmail == this.allUsers[i].officialEmail)[0]
          if (fieldData && fieldData.type)
            this.allUsers[i].type = fieldData.type
          if (fieldData && fieldData.billable)
            this.allUsers[i].billable = fieldData.billable
          if (fieldData && fieldData.hoursAssign)
            this.allUsers[i].hoursAssign = fieldData.hoursAssign
        }
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    } else {
      this.allUsers = this.allProjectMembers;
    }
  }

  getEmployeesByIds(employeeIds) {
    console.log("employeeIds  ", employeeIds)
    this.commonService.getEmployeesByIds(employeeIds).then(resp => {
      this.allUsers = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event) => {
    //console.log(event.html);
  }

  onFocus = () => {
    console.log("On Focus");
  }
  onBlur = () => {
    console.log("Blurred");
  }

  selectRole(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      type: user.type
    }
    this.projectService.updateProjectMember(form).then(resp => {
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  selectBillable(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      billable: user.billable
    }
    this.projectService.updateProjectMember(form).then(resp => {
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  selectHours(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      hoursAssign: user.hoursAssign
    }
    this.projectService.updateProjectMember(form).then(resp => {
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }

    })
  }

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      spinner: "circles",
      // duration: 1000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }



}
