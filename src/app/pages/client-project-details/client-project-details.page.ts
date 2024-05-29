import { Component, ViewChild, Renderer2, ElementRef, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectEpicDetailsPage } from '../../modals/project-epic-details/project-epic-details.page';
import { ProjectStoryDetailsPage } from '../../modals/project-story-details/project-story-details.page';
import Gantt from 'frappe-gantt';
import "quill-mention";
import { AddNotePage } from 'src/app/modals/add-note/add-note.page';

@Component({
  selector: 'app-client-project-details',
  templateUrl: './client-project-details.page.html',
  styleUrls: ['./client-project-details.page.scss'],
})
export class ClientProjectDetailsPage implements OnInit {

  projectId: any = 0;
  ganttWidth: any = 0;
  selectedEpicIndex: any = 0;
  selectedStoryIndex: any = 0;
  selectedEpic: any = {};
  selectedStory: any = 0;
  ganttMode: any = 'Day'
  isOpen = false;
  projects: any;
  selectedMembers: any = [];
  epicTasksList: any = [];
  epicTasksListOriginal: any = [];
  selectedEpicId: any = 'all';
  selectedColumns: any = 'all';
  searchTaskTerm: any;
  sprintSegment: any = 'ongoing';
  selectedTasks: any = {};

  myFileInput: ElementRef;
  files: File;

  @ViewChild('gantt') ganttEl: ElementRef;
  atValues = [
    { id: 1, value: 'Fredrik Sundqvist' },
    { id: 2, value: 'Patrik Sjölin' }
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ]
  quillConfig = {
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }, 'link', 'emoji'],
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

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === "@") {
          values = this.atValues;
        } else {
          values = this.hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    "emoji-toolbar": false,
    "emoji-textarea": false,
    "emoji-shortname": false,
    keyboard: {
      bindings: {
        shiftEnter: {
          key: 13,
          shiftKey: true,
          handler: (range, context) => {
            // Handle shift+enter
            // console.log("shift+enter")
          }
        },
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

  segment: any = 'dashboard'
  epics: any = []
  gantt: any;
  windowHeight: any = 0;
  projectEpics: any = [
    {
      id: 'sample',
      name: 'Sample Epic',
      start: this.commonService.formatDate(new Date()),
      end: this.commonService.formatDate(new Date()),
      progress: 0
    }
  ];
  epicStories: any = [];
  epicStoriesArray: any = [];
  storyTasks: any = [];
  projectEpicsTest: any = [
    {
      id: 'Task 1',
      name: 'Sample Epic',
      start: this.commonService.formatDate(new Date()),
      end: this.commonService.formatDate(new Date()),
      progress: 0
    }
  ];
  toggleMenu: boolean = true;
  teamBoardColumns: any = [];
  connectedTo: any = [];
  projectMembers: any = [];
  projectName: any = "";
  projectMembers1: any = [];
  allUsers: any = [];
  userLogin: any;
  enableFields: boolean = true;
  userId: string;
  allDocs: any;
  responseLength: any;
  id: any;
  allNotes: any;
  sprintTasks: any = [];
  sprintTasksAssignment: any = {};
  sprintTasksAssignmentIds: any = [];
  estimatedHours: any = 0;

  constructor(
    private router: Router,
    private tasksService: TasksService,
    private menuController: MenuController,
    private modalController: ModalController,
    private activated: ActivatedRoute,
    public authService: AuthService,
    private projectService: ProjectService,
    private alertController: AlertController,
    private commonService: CommonService,
  ) { }



  logScrolling(ev) {
    // this.top = ev.detail.scrollTop;
    // console.log("logScrolling")
  }

  segmentChanged() {
    // this.sprintSegment = 'ongoing';
  }

  createSprint() {

    let tasks = this.epicTasksList.filter(e => e['checkedForSprint'] == true)

    this.sprintTasksAssignment = {};
    tasks.forEach(task => {
      if (!this.sprintTasksAssignment[task.assignee])
        this.sprintTasksAssignment[task.assignee] = 0;
      // let user = this.projectMembers.filter(m => m.employeeId == task.assignee);
      this.sprintTasksAssignment[task.assignee] = this.sprintTasksAssignment[task.assignee] + task.estimatedHours;
      this.estimatedHours += task.estimatedHours
    })
    this.sprintTasksAssignmentIds = Object.keys(this.sprintTasksAssignment);
    // console.log("sprintTasksAssignment ", this.sprintTasksAssignment)
    // console.log("sprintTasksAssignmentIds ", this.sprintTasksAssignmentIds)
    // this.sprintSegment = 'new';

    // this.estimatedHours = parseFloat(this.estimatedHours).toFixed(2);
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  toggleMenuButton() {
    this.toggleMenu = !this.toggleMenu;
    this.menuController.enable(this.toggleMenu);
  }

  downloadExcel() {
    let url = this.authService.apiUrl + "downloadProjectExcel?projectId=" + this.projectId;
    window.location.assign(url);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.projectId = this.activated.snapshot.params.id;
    console.log("projectId", this.projectId)
    let that = this;
    this.projectName = "";
    this.projects = [];
    this.projectId = this.activated.snapshot.params.id;

    this.projectService.getMemberProjects().then((resp: any) => {
      console.log("resp", resp)
      this.projects = resp;
      console.log("this.projects", this.projects)
      this.projectName = this.projects.filter(project => project.projectId == this.projectId)[0]?.projectName
    })
    console.log("projectName", this.projectName)

    // this.projectService.getProjectColumns({ projectId: this.projectId }).then((columns: any) => {
    //   columns.forEach(c => {
    //     c.tasks = []
    //     this.connectedTo.push("box" + c.columnId);
    //     // this.getTasks(c);
    //   })
    //   this.teamBoardColumns = columns;
    // })

    // console.log("window height ", window.innerHeight)
    this.windowHeight = (window.innerHeight - 90) + 'px';

    this.gantt = new Gantt("#gantt", this.projectEpics, {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_mode: 'Day',
      view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month', 'Year'],
      bar_height: 30,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 20,
      date_format: 'YYYY-MM-DD',
      custom_popup_html: null,
      draggable: true,
      on_click: function (task) {
        // console.log(task);
      },
      on_drag: function (task) {
        // console.log(task);
        let taskObj = Object.assign(task);
        taskObj.id = parseInt((task.id).replace('epic', ''))
        that.projectService.updateProjectEpic(taskObj);
      },
      on_date_change: function (task, start, end) {
        // console.log(task);
        let taskObj = Object.assign(task);
        taskObj.start = that.commonService.formatDate(start)
        taskObj.end = that.commonService.formatDate(end)
        taskObj.id = parseInt((task.id).replace('epic', ''))
        that.projectService.updateProjectEpic(taskObj);
      },
      on_progress_change: function (task, progress) {
        // console.log(task, progress);
      },
      on_view_change: function (mode) {
        // console.log(mode);
      }
    });

    this.authService.userLogin.subscribe(resp => {
      if (resp && Object.keys(resp).length > 0) {
        console.log("userLogin resp ", resp);
        this.userLogin = resp;
        this.commonService.presentLoading();
        this.projectService.getProjectMembers({ projectId: this.projectId }).then(members => {
          console.log("project members ", members)
          this.commonService.loadingDismiss();
          this.projectMembers = members;
          this.projectMembers1 = members;
          this.allUsers = members;

          ///Added by parul for disabling fields i.e only project manager will be able to edit the fields

          let projectManager = this.projectMembers.filter(id => id.employeeId == this.userLogin.employeeId)[0];
          console.log("project Manager", projectManager)
          if (projectManager != null && projectManager.type == "Manager") {
            this.enableFields = false;
          }
          // this.selectedTeam = resp[0].teamId;
          // this.tasksService.fetchTeamColumns(this.selectedTeam).then((columns:any) => {
          //   columns.forEach(c => {
          //     c.tasks = []
          //     this.connectedTo.push("box" + c.columnId);
          //     this.getTasks(c);
          //   })
          //   this.teamBoardColumns = columns;
          // })
          // this.projectService.getMemberProjects().then(resp => {
          //   this.memberProjects = resp;
          // })

          // this.tasksService.filterDsr({month: month+1}).then( resp => {
          //   console.log("resp filterDsr ",resp);
          // })
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
      }
    })

    this.projectService.getProjectColumns({ projectId: this.projectId }).then((columns: any) => {
      columns.forEach(c => {
        c.tasks = []
        this.connectedTo.push("box" + c.columnId);
        // this.getTasks(c);
      })
      this.teamBoardColumns = columns;
      // this.selectEpic(that.selectedEpic, 0);
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })


    this.projectService.getProjectEpics({ projectId: this.projectId }).then((epics: any) => {
      if (epics.length > 0) {
        epics.forEach(epic => {
          epic.id = "epic" + epic.id;
          delete epic.projectId;
        })

        let epicsData = [];
        for (var i = 0; i < 20; i++) {
          epicsData.push({
            id: 'Task ' + i,
            name: 'Redesign website',
            start: '2022-09-18',
            end: '2022-09-30',
            progress: 20
          })
        }

        // this.projectEpics = epicsData;
        this.projectEpics = epics;
        that.selectedEpic = that.projectEpics[0];
        // that.selectEpic(that.selectedEpic, 0)

        this.projectEpics.forEach((epic, index) => {
          this.fetchEpicStories(epic, index)
        })

        // this.projectService.getProjectColumns({ projectId: this.projectId }).then((columns: any) => {
        //   columns.forEach(c => {
        //     c.tasks = []
        //     this.connectedTo.push("box" + c.columnId);
        //     // this.getTasks(c);
        //   })
        //   this.teamBoardColumns = columns;
        //   this.selectEpic(that.selectedEpic, 0);
        // })

        // console.log("this.projectEpics getProjectEpics ", this.projectEpics)
        this.gantt.refresh(this.projectEpics);
      }
    }, error => {
      this.commonService.showToast('error', error.error)
    })


    const myTimeout = setTimeout(myStopFunction, 200);

    // let topScroller = document.getElementById('topScroller');
    // topScroller.addEventListener('scroll', el => {
    //   console.log("addEventListener topScroller " + window.scrollX);

    //   // setTimeout(() => {
    //   //   console.log("setTimeout topScroller " + window.scrollX);
    //   // }, 1000);

    // })

    var userSelection = document.getElementsByClassName('gantt-container');
    userSelection[0].addEventListener('scroll', el => {
      // console.log("userSelection getElementsByClassName ");

      let topScroller = document.getElementById('topScroller');
      topScroller.scrollLeft = userSelection[0].scrollLeft;
    })


    let topScroller = document.getElementById('topScroller');
    topScroller.addEventListener('scroll', el => {
      var userSelection = document.getElementsByClassName('gantt-container');
      userSelection[0].scrollLeft = topScroller.scrollLeft;
    })

    function myStopFunction() {
      var userSelection = document.getElementsByClassName('gantt-container');
      // var gant = document.getElementById('gantt');
      userSelection[0].classList.add('ganttTest');

      let sl = userSelection[0].scrollLeft,
        cw = userSelection[0].scrollWidth;

      // console.log("sl " + sl);
      // console.log("cw " + cw);

      that.ganttWidth = cw;

      userSelection[0].scrollLeft = cw / 4;

      clearTimeout(myTimeout);
    }
    this.getDocs();
    this.getNotes();
  }




  fetchEpicStories(epic, index) {
    // this.selectedEpicIndex = index;
    // this.selectedEpic = epic;
    // console.log("fetchEpicStories", epic)
    // let c = 0;
    this.projectService.getEpicStories({ epicId: (epic.id).replace('epic', '') }).then((stories: any) => {
      // this.epicStories = stories;
      epic.stories = stories;
      // console.log("thgis.epicstories", this.epicStories)
      if (index == 0) {
        this.selectedEpicIndex = 0;
        this.selectedStoryIndex = 0;
        this.epicStories = epic.stories;
        this.selectedStory = this.epicStories[this.selectedStoryIndex];
        // this.selectEpic(epic, 0)
      }
      if (stories.length == 0) {
        this.storyTasks = [];
      }
      epic.stories.forEach((story, i) => {
        story.columnTasks = JSON.parse(JSON.stringify(this.teamBoardColumns))
        this.projectService.getStoryTasks({ storyId: story.id }).then(async (tasksData: any) => {
          story.tasks = tasksData.sort((a, b) => {
            if (a.projectTaskNumber > b.projectTaskNumber) {
              return -1;
            }
            if (a.projectTaskNumber < b.projectTaskNumber) {
              return 1;
            }
            return 0;
          });
          if (index == 0 && i == 0) {
            this.storyTasks = tasksData;
          }
          story.columnTasks.forEach((column, j) => {
            let filteredTasks = tasksData.filter(t => t.columnId == column.columnId && t.storyId == story.id);
            if (filteredTasks.length > 0) {
              column.tasks = filteredTasks;
            }
          })
          this.epicStoriesArray = Object.assign(epic.stories, {});
          this.epicTasksList = this.flat(this.projectEpics).sort((a, b) => {
            if (a.projectTaskNumber < b.projectTaskNumber) {
              return -1;
            }
            if (a.projectTaskNumber > b.projectTaskNumber) {
              return 1;
            }
            return 0;
          });
          this.epicTasksListOriginal = this.flat(this.projectEpics).sort((a, b) => {
            if (a.projectTaskNumber < b.projectTaskNumber) {
              return -1;
            }
            if (a.projectTaskNumber > b.projectTaskNumber) {
              return 1;
            }
            return 0;
          });
          // console.log("this.epicTasksList",this.epicTasksList,this.selectedStory)
          // console.log("this.epicStoriesArray ", this.epicStoriesArray)
        })
      });

    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  flat(array) {

    let newArray = array.slice();

    let epicList = [];

    // console.log("newArray ", newArray)
    newArray.forEach(function (epic) {
      if (Array.isArray(epic.stories)) {
        epic.stories.forEach(story => {
          if (story && story['tasks'] && story['tasks'].length > 0) {
            story['tasks'].forEach(task => {
              task["storyId"] = story['id'];
              task["storyName"] = story['name'];
              task["epicId"] = epic['id'];
              task["epicName"] = epic['name'];
              epicList.push(task);
            })
          }

        })
      }
    });

    // console.log("flat ", epicList)

    return epicList;
  }

  // var data = [{ id: "acc.1260446672222.11", type: "EXPENSES_FOLDER", name: "Expense Group", balance: 3418.11, children: [{ id: "acc.1260446672238.27", type: "EXPENSE", name: "Advertising, Promotion and Entertainment Account", balance: 0, children: [] }, { id: "acc.9a2492ba-0d82-4f4a-a1b4-14868f1e1a39", type: "EXPENSES_FOLDER", name: "Premises Costs", balance: 0, children: [{ id: "acc.287ba5b6-5536-428b-950f-d71d2af73ccc", type: "EXPENSE", name: "Use of Home - Gas", balance: 0, children: [] }, { id: "acc.7091ee15-3f02-4bd1-94e5-5918cf986969", type: "EXPENSE", name: "Hire of Venue, Studios, Teaching Rooms", balance: 0, children: [] }] }, { id: "acc.827ec446-edeb-4f2b-8032-d306292d2d83", type: "EXPENSES_FOLDER", name: "Administrative Expenses", balance: 558.61, children: [{ id: "acc.0ed5fc81-7734-4452-86a9-db22a6b0f8e8", type: "EXPENSE", name: "Bank Charges", balance: 15, children: [] }, { id: "acc.e2cdb2c0-8565-4991-a35a-d4596b0ddf45", type: "EXPENSE", name: "Software & Computer Peripherals", balance: 417.13, children: [] }, { id: "acc.96d5d00e-43f4-4d3a-b97b-fdf258c65514", type: "EXPENSE", name: "Printing, photocopying etc", balance: 55.93, children: [] }, { id: "acc.494dd64a-4fb3-42b8-be3e-8f3b59a2ef59", type: "EXPENSE", name: "Artists Administration Service", balance: 0, children: [] }, { id: "acc.1260446672238.35", type: "EXPENSE", name: "Stationery", balance: 0, children: [] }, { id: "acc.96d89d0d-5465-488b-b37f-d41ca114c5e6", type: "EXPENSE", name: "Mobile Telephone", balance: 41.19, children: [] }, { id: "acc.1260446672238.33", type: "EXPENSE", name: "Home Telephone", balance: 0, children: [] }, { id: "acc.1260446672238.38", type: "EXPENSE", name: "Postage/delivery", balance: 29.36, children: [] }] }, { id: "acc.b9c9bbc7-43df-472e-9ac8-c7c76f08f49a", type: "EXPENSES_FOLDER", name: "Instruments, Equipment Maintenance etc", balance: 1002.48, children: [{ id: "acc.1260446672238.32", type: "OTHER_EXPENSES", name: "Instrument Insurance", balance: 157.48, children: [] }, { id: "acc.2a1cca15-2868-4770-a3e7-d43a6268c6a1", type: "EXPENSE", name: "Instrument Repairs & Maintenance", balance: 845, children: [] }, { id: "acc.a908aee0-84fb-450a-916b-4cec25265aef", type: "EXPENSE", name: "Accessories & Replacement Parts", balance: 0, children: [] }] }, { id: "acc.a42cdd86-0d9e-4f3f-af0d-7c4525374731", type: "EXPENSES_FOLDER", name: "Motor Vehicle", balance: 0, children: [{ id: "acc.cb325e7e-0ce4-4c78-9cb4-20659df733a6", type: "EXPENSE", name: "Fuel and Oil", balance: 0, children: [] }] }, { id: "acc.4bdd9e26-ce64-4e7f-b46a-82ec9de06ded", type: "EXPENSES_FOLDER", name: "Other Travel", balance: 132.1, children: [{ id: "acc.77dd2142-f2de-4a2c-9247-061d0661bc0a", type: "EXPENSE", name: "Taxis", balance: 24.5, children: [] }, { id: "acc.2b54abdd-7ef5-43cd-bdb9-c8c981b59ff2", type: "EXPENSE", name: "Public Transport", balance: 107.6, children: [] }] }, { id: "acc.e4695b70-31fa-4e23-afd0-97335dcd5b9e", type: "EXPENSE", name: "Subsitence", balance: 0, children: [] }, { id: "acc.02d222bf-4dff-4308-afe9-69b93f412ada", type: "EXPENSE", name: "Hotel and Accomodation", balance: 0, children: [] }, { id: "acc.d61cd5b4-2c80-4ab8-93d0-9d5726bd253b", type: "EXPENSES_FOLDER", name: "Fees and Commission Paid", balance: 0, children: [{ id: "acc.1262189019758.7", type: "EXPENSE", name: "Pupils exam entry fees", balance: 0, children: [] }, { id: "acc.a7d7efd3-d0da-4704-babb-079b6077f3fe", type: "EXPENSE", name: "Audition, competition entry fees", balance: 0, children: [] }, { id: "acc.3b91ee4e-40a8-46d8-aa05-3afa5974b3ef", type: "EXPENSE", name: "Deputies, Other Musicians", balance: 0, children: [] }] }, { id: "acc.250d6872-6023-4599-a0b6-b7159eebbfa1", type: "EXPENSES_FOLDER", name: "Other Professional Expenses", balance: 1739.42, children: [{ id: "acc.b7315228-f85a-4ffb-9199-d1128a409e5f", type: "EXPENSE", name: "Promotion & Publicity", balance: 138.6, children: [] }, { id: "acc.69ca2005-d7a0-448b-b70c-dafb128a48ae", type: "EXPENSE", name: "Other Expenses", balance: 364.5, children: [] }, { id: "acc.dcd999d2-4e18-41be-b9cc-218d4034b88e", type: "EXPENSE", name: "Office Equipment, Furniture", balance: 0, children: [] }, { id: "acc.e0460706-d5c9-4c40-9d1e-0d2058864b92", type: "EXPENSE", name: "CDs, Dowloads etc", balance: 67.57, children: [] }, { id: "acc.1866df79-9e44-459a-a978-727904987469", type: "EXPENSE", name: "Professional Books, Magazines", balance: 104.01, children: [] }, { id: "acc.24c1651d-e7ae-48bc-a32d-311427e0fcea", type: "EXPENSE", name: "Professional Associations", balance: 272.17, children: [] }, { id: "acc.289ab0ac-b9d3-435e-ac82-9da9702b7d4b", type: "EXPENSE", name: "Tuition", balance: 470, children: [] }, { id: "acc.f24cf99b-6291-4b9f-821e-425f4909d4e1", type: "EXPENSE", name: "Scores, Manuscript Paper etc", balance: 215.32, children: [] }, { id: "acc.1af95953-56f0-455e-9d0a-7c4e0477cf0d", type: "EXPENSE", name: "Performance Clothing", balance: 0, children: [] }, { id: "acc.c0585577-535a-4ae2-a02b-e5b249f67c67", type: "EXPENSE", name: "Concerts, Shows etc", balance: 107.25, children: [] }] }, { id: "acc.1260446672222.24", type: "ADMIN", name: "Administrative Expenses", balance: 0, children: [] }, { id: "acc.1260446672238.26", type: "TRAVEL", name: "Travel and Subsistence Account", balance: -14.5, children: [] }, { id: "acc.1260446672238.28", type: "LEGAL", name: "Legal and Professional Costs Account", balance: 0, children: [] }, { id: "acc.1260446672238.36", type: "OTHER_EXPENSES", name: "Rent/Rates", balance: 0, children: [] }, { id: "acc.1262191376548.37", type: "EXPENSE", name: "Research", balance: 0, children: [] }, { id: "acc.1262191388329.38", type: "EXPENSE", name: "Professional Development", balance: 0, children: [] }, { id: "acc.1262192291558.52", type: "EXPENSE", name: "Professional Presentation", balance: 0, children: [] }, { id: "acc.1262193596634.72", type: "EXPENSE", name: "Subscriptions", balance: 0, children: [] }, { id: "acc.1262265941130.16", type: "EXPENSE", name: "Piano accompaniment", balance: 0, children: [] }, { id: "acc.1267370824329.1", type: "EXPENSE", name: "Cost of Sales", balance: 0, children: [] }] }],
  //     result = flat(data);

  selectEpic(epic, index) {
    this.selectedEpicIndex = index;
    this.selectedEpic = epic;
    this.epicStories = epic.stories
    // console.log(epic)
    // if (index == 0) {
    this.selectedStoryIndex = 0;
    if (epic.stories) {
      this.selectedStory = this.epicStories[this.selectedStoryIndex];
    }
    else {
      this.selectedStory = null;
    }
    console.log("selected story", this.selectedStory, epic)
    this.selectStory(this.selectedStory, 0)

  }

  selectStory(story, index) {
    // console.log("hello", this.epicStoriesArray, this.selectedStory)
    this.selectedStoryIndex = index;
    this.selectedStory = story;
    // this.storyTasks = story.tasks || [];
    console.log("story--------------------------", story, this.teamBoardColumns, this.selectedStory, this.storyTasks)
    if (story) {
      let columnTasks = story.columnTasks;
      this.storyTasks = (columnTasks[0].tasks).concat(columnTasks[1].tasks).concat(columnTasks[2].tasks).concat(columnTasks[3].tasks) || [];
    }
    else {
      this.storyTasks = [];
    }
    // this.storyTasks = story?.columnTasks[0]?.tasks || [];
    // console.log("this.storyTasks", this.storyTasks)
  }

  addTask() {
    let newTask = { taskName: "", projectId: 0 };
    // this.teamBoardColumns[0].tasks.unshift(newTask);
    // this.editTask(newTask, 0, 0);
    // console.log("addTask  ");
  }

  onBlur(event, item, c, i) {
    item['edit'] = false;
    if (item.name == '') {
      this.teamBoardColumns[c].tasks.splice(i, 1)
    } else {

    }
    item.focus = false;
  }

  taskNameUpdated(ev, item, c, i) {
    item['taskName'] = ev.target.value;
    // console.log("taskNameUpdated  ");/
    if (item.taskId) {
      // this.updateTask(item);
    } else {
      // item.teamId = this.selectedTeam;
      // item.date = this.taskDate;
      // item.columnId = this.teamBoardColumns[c].columnId
      this.tasksService.createTask(item).then((resp: any) => {
        item.taskId = resp.taskId;
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

  async drop(event: CdkDragDrop<string[]>) {
    // console.log("CdkDragDrop event", event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        this.updateTask(task);
      })
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // console.log("CdkDragDrop event.container.id", event.container.id)
      // console.log("CdkDragDrop event.previousIndex", event.previousIndex)
      // console.log("CdkDragDrop event.currentIndex", event.currentIndex)
      // console.log("CdkDragDrop event.container.data", event.container.data)
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        task.columnId = event.container.id
        this.updateTask(task);
      })
    }
  }

  updateTask(task) {
    this.projectService.updateProjectTask(task).then((resp: any) => {

    })
  }

  updateEpic(epic) {
    this.projectService.updateProjectEpic(epic).then((resp: any) => {
      this.gantt.refresh(this.projectEpics);
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  updateStory(story) {
    this.projectService.updateEpicStory(story).then((resp: any) => {

    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  assignTaskOverlay(item, i) {
    item.isOpen = !item.isOpen
    item.index = i;
  }

  assignTask(item, user) {
    item.assignee = user.employeeId;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    item.image = user.image;
    item.isOpen = !item.isOpen
    this.updateTask(item);
  }

  getAssigneeDetails(item, data) {
    if (item) {
      let user = this.projectMembers.filter(e => e.employeeId == item.assignee);
      if (user.length > 0)
        return user[0][data] || ''
      else
        return ''
    } else {
      return ''
    }
  }

  getListAssigneeDetails(item, key, data) {
    if (item) {
      let user = this.projectMembers.filter(e => e.employeeId == item[key]);
      if (user.length > 0)
        return user[0][data] || ''
      else
        return ''
    } else {
      return ''
    }
  }


  getTeamBoardColumns(columnId) {
    let column = this.teamBoardColumns.filter(column => column.columnId == columnId);
    // console.log("getTeamBoardColumns ", column)
    return column[0].columnName;
  }

  selectEpicTasks(event) {
    this.selectedEpicId = event.target.value;
    console.log("selectedEpicId ", this.selectedEpicId)
    this.filterEpicTasks();
    // if (this.selectedEpicId == 'all') {
    //   this.epicTasksList = this.epicTasksListOriginal
    // }
    // else {
    //   this.epicTasksList = this.epicTasksListOriginal.filter(epic => epic.epicId == this.selectedEpicId)
    //   console.log(this.selectedEpicId)
    //   console.log(this.projectEpics)
    //   this.epicStories = this.projectEpics.filter(epic => epic.id == this.selectedEpicId)[0]['stories']
    //   console.log("this.epicStories ", this.epicStories)
    // }
    // this.epicTasksList = this.flat([this.selectedListEpic]);
  }


  updateTaskStatus(item) {
    item.status = !item.status;
    item.completionDate = new Date();
    this.updateTask(item);
  }

  selectMemberTasks(member) {
    member.selected = !member.selected
    let selectedMembers = this.projectMembers.filter(m => m.selected == true)
    // console.log("selectedMembers ", selectedMembers)
    let members = [];
    selectedMembers.forEach(m => {
      members.push(m.employeeId)
    })
    this.selectedMembers = members;
    this.filterEpicTasks();

    // let filteredStories = this.epicStoriesArray.map((element) => {
    //   return {...element, tasks: element.tasks.filter((subElement) => members.indexOf(subElement.assignee) > -1)}
    // })

    // console.log("filteredStories ", filteredStories)
  }

  selectListColumns(event) {
    this.selectedColumns = event.target.value;
    console.log("event ", event.target.value);
    this.filterEpicTasks();
  }

  searchTasks(ev) {
    this.searchTaskTerm = ev.target.value
    if (this.searchTaskTerm) {
      this.segment = 'list';
      this.filterEpicTasks();
    } else {
      this.epicTasksList = this.epicTasksListOriginal;
      this.filterEpicTasks();
    }
  }

  filterEpicTasks() {
    var filteredArray = this.epicStoriesArray.filter(element => element.tasks
      .some(subElement => this.selectedMembers.indexOf(subElement.assignee) > -1)
    ).map(element => {
      let n = Object.assign({}, element, {
        'tasks': element.tasks.filter(
          subElement => this.selectedMembers.indexOf(subElement.assignee) > -1
        )
      })
      return n;
    })
    if (this.selectedMembers.length > 0)
      this.epicStories = filteredArray;
    else
      this.epicStories = this.epicStoriesArray;
    // console.log("this.selectedMembers ", this.selectedMembers)
    // console.log("this.epicTasksListOriginal ", this.epicTasksListOriginal)

    this.epicTasksList = this.epicTasksListOriginal;

    if (this.selectedMembers.length > 0)
      this.epicTasksList = this.epicTasksListOriginal.filter(e => this.selectedMembers.indexOf(e.assignee) > -1);

    if (this.selectedColumns != 'all')
      this.epicTasksList = this.epicTasksList.filter(e => e.columnId == this.selectedColumns);

    if (this.selectedEpicId != 'all')
      this.epicTasksList = this.epicTasksList.filter(e => e.epicId == this.selectedEpicId);

    console.log("this.searchTaskTerm ", this.searchTaskTerm)
    if (this.searchTaskTerm && this.searchTaskTerm.length > 0) {
      // this.selectedMembers = [];
      // this.selectedColumns = 'all';
      // this.selectedEpicId = 'all';
      this.epicTasksList = this.epicTasksList.filter(e => e.taskName.toLowerCase().includes(this.searchTaskTerm.toLowerCase()) || e.projectTaskNumber.toString().includes(this.searchTaskTerm));
    }

  }

  async addEpic() {
    let date = this.commonService.formatDate(new Date());
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter epic details!',
      inputs: [
        {
          name: 'epicName',
          type: 'text',
          placeholder: 'Epic name'
        },
        {
          name: 'epicStartDate',
          value: date,
          type: 'date',
          placeholder: 'Start Date'
        },
        {
          name: 'epicStopDate',
          value: date,
          type: 'date',
          placeholder: 'Start Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Add',
          handler: (epicData) => {

            let epic = {}
            epic['name'] = epicData.epicName;
            epic['start'] = epicData.epicStartDate;
            epic['end'] = epicData.epicStopDate;
            epic['progress'] = 0;
            epic['reporter'] = this.authService.userId;
            epic['projectId'] = this.projectId;
            epic['stories'] = [];

            if (epic['name'] && epic['start'] && epic['end']) {
              this.projectService.createEpic(epic).then((resp: any) => {
                epic['id'] = "epic" + resp.id;

                if (that.projectEpics[0].id == 'sample') {
                  that.projectEpics = [epic];
                  that.selectedEpic = epic;
                }
                else {
                  that.projectEpics.push(epic)
                }

                that.gantt.refresh(that.projectEpics);
                // console.log("that.projectEpics ", that.projectEpics)
              }, error => {
                this.commonService.showToast('error', error.error.msg);
                if (error.error.statusCode == 401) {
                  localStorage.clear();
                  sessionStorage.clear();
                  this.router.navigateByUrl('/login')
                }
              })
            }
            else {
              this.commonService.showToast('error', 'Please fill all fields')
            }

          }
        }
      ]
    });
    await alert.present();
  }


  async addStory() {
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter story details!',
      inputs: [
        {
          name: 'storyName',
          type: 'textarea',
          placeholder: 'Story name'
        },
        // {
        //   label: 'Start Date',
        //   name: 'storyStartDate',
        //   value: date,
        //   type: 'date',
        //   placeholder: 'Start Date'
        // },
        // {
        //   label: 'End Date',
        //   name: 'epicStopDate',
        //   value: date,
        //   type: 'date',
        //   placeholder: 'Start Date'
        // }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Add',
          handler: (epicData) => {

            console.log("this.selectedEpic ", this.selectedEpic)
            let story = {}
            // let teamBoardColumn = Object.create(that.teamBoardColumns)
            story['name'] = epicData.storyName,
              story['progress'] = 0,
              story['reporter'] = this.authService.userId;
            story['epicId'] = (this.selectedEpic.id).replace('epic', '')
            story['projectId'] = this.projectId


            if (story['name']) {
              this.projectService.createStory(story).then((resp: any) => {
                story['id'] = resp.id;
                console.log("epicstories", this.epicStories)
                if (!that.epicStories) {
                  that.epicStories = []
                }
                that.epicStories.push(story)
                if (that.epicStories.length == 1)
                  that.selectedStory = that.epicStories[0];
                // p;
                that.epicStories[that.epicStories.length - 1]['columnTasks'] = JSON.parse(JSON.stringify(this.teamBoardColumns))
                // that.epicStories[that.epicStories.length - 1]['columnTasks'][0]['tasks'] = []
                console.log("that.epicStories", that.epicStories)
                // that.selectedStory['columnTasks'] = teamBoardColumns;
                console.log("story", that.epicStories, that.teamBoardColumns, that.selectedStory)
                this.selectStory(that.selectedStory, this.epicStories.length - 1)
                // this.gantt.refresh(that.projectEpics);
                // console.log("that.projectEpics ", that.projectEpics)
              })
            }
            else {
              this.commonService.showToast('error', 'Please fill all fields')
            }

          }
        }
      ]
    });
    await alert.present();
  }


  async addStoryTask() {
    let date = this.commonService.formatDate(new Date());
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter task!',
      inputs: [
        {
          name: 'taskName',
          type: 'textarea',
          placeholder: 'Task name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Add',
          handler: (taskData) => {
            let task = {}

            // console.log("that.that.storyTasks ", that.storyTasks, that.selectedStory, that.teamBoardColumns)
            task['taskName'] = taskData.taskName;
            task['estimatedHours'] = 0;
            task['priority'] = 0;
            task['taskType'] = 0;
            task['employeeId'] = this.authService.userId;
            if (this.epicTasksListOriginal && this.epicTasksListOriginal.length > 0)
              task['projectTaskNumber'] = Math.max(...this.epicTasksListOriginal.map(o => o.projectTaskNumber)) + 1;
            else
              task['projectTaskNumber'] = 1
            task['order'] = that.storyTasks.length;
            task['reporter'] = this.authService.userId;
            task['columnId'] = that.teamBoardColumns[0].columnId;
            task['epicId'] = (this.selectedEpic.id).replace('epic', '');
            task['epicName'] = this.epicStories.filter(e => e.epicId = task['epicId'])[0]['epicName']
            task['storyId'] = (this.selectedStory.id);
            task['projectId'] = this.projectId;

            // console.log("task ", task)

            if (task['taskName'] && task['estimatedHours'] >= 0) {
              this.projectService.createStoryTask(task).then((resp: any) => {
                task['taskId'] = resp.taskId;
                that.storyTasks.unshift(task)
                console.log("selected story", that.storyTasks)
                that.selectedStory.columnTasks[0].tasks.push(task);
                // for(let i=0;i<this.teamBoardColumns.length;i++)
                // {
                //   this.teamBoardColumns[i]['tasks'] = []
                // }
                console.log("selected story", this.selectedStory)

                that.epicTasksList.push(task);///
                // that.epicTasksList[that.epicTasksList.length - 1]['epicId'] = "epic"+task['epicId'];
                that.epicTasksList[that.epicTasksList.length - 1]['epicName'] = that.selectedEpic.name;
                that.epicTasksList[that.epicTasksList.length - 1]['storyName'] = that.selectedStory.name;
                that.epicTasksList[that.epicTasksList.length - 1]['createdAt'] = new Date().toISOString();

                that.epicTasksListOriginal.push(task);///
                that.epicTasksListOriginal[that.epicTasksListOriginal.length - 1]['epicId'] = "epic" + task['epicId'];
                that.epicTasksListOriginal[that.epicTasksListOriginal.length - 1]['epicName'] = that.selectedEpic.name;
                that.epicTasksListOriginal[that.epicTasksListOriginal.length - 1]['storyName'] = that.selectedStory.name;
                that.epicTasksListOriginal[that.epicTasksListOriginal.length - 1]['createdAt'] = new Date().toISOString();

                console.log("that.epicTask", that.epicTasksList, that.selectedStory)
                // that.gantt.refresh(that.projectEpics);
                console.log("that.epic ", that.epicStories, that.storyTasks)
              }, error => {
                this.commonService.showToast('error', error.error)
              })
            }
            else {
              this.commonService.showToast('error', 'Please fill all fields')
            }

          }
        }
      ]
    });
    await alert.present();
  }

  async viewTaskDetails(item, story) {
    const popover = await this.modalController.create({
      component: ProjectTaskDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        item,
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      console.log(resp);
      if (resp.data?.action == 'delete') {
        ////Added by Parul
        this.storyTasks.splice(this.storyTasks.indexOf(item), 1);
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        this.epicTasksList.forEach(element => {   /////Added by parul for deleting task from list tab
          if (element.taskId == item.taskId) {
            this.epicTasksList.splice(this.epicTasksList.indexOf(item), 1);
            this.epicTasksListOriginal.splice(this.epicTasksListOriginal.indexOf(item), 1);

          }
        });
        console.log("this.epic", this.epicStories, this.selectedStory, this.epicTasksList)
      }
      if (resp.data?.status == 1 && story == null) {
        console.log("story", this.selectedStory, item)
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        for (let i = 0; i < this.selectedStory.columnTasks.length; i++) {
          if (this.selectedStory.columnTasks[i].columnId == item.columnId) {
            this.selectedStory.columnTasks[i].tasks.push(item)
          }
        }
        this.updateTask(item);
        console.log("task", this.selectedStory, this.storyTasks)
        // var task = this.selectedStory.columnTasks.filter(id=>id.columnId == item.columnId)[0]
        // task.tasks()
      }
      if (resp.data?.status == 1 && story) {
        console.log("task", story, item)
        story.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              story.columnTasks[i].tasks.splice(story.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        for (let i = 0; i < story.columnTasks.length; i++) {
          if (story.columnTasks[i].columnId == item.columnId) {
            story.columnTasks[i].tasks.push(item)
          }
        }
        this.updateTask(item);
        console.log("task", this.selectedStory, this.storyTasks)
        // var task = this.selectedStory.columnTasks.filter(id=>id.columnId == item.columnId)[0]
        // task.tasks()
      }
      else {
        console.log("itemsss", item)
        this.updateTask(item);
      }
    })
  }

  async viewEpicDetails(epic) {
    this.updateEpic(epic);
    const popover = await this.modalController.create({
      component: ProjectEpicDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        epic,
        projectMembers: this.projectMembers
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {
      console.log("that.onDidDismiss ");

      // Added by Ritika
      if (resp.data?.action == 'delete') {
        this.projectEpics.splice(this.projectEpics.indexOf(epic), 1);
        this.epicStories = [];
        this.storyTasks = [];
        console.log("epicssss", this.epicTasksList)
      } else {
        this.updateEpic(epic);
      }

    })
  }

  async viewStoryDetails(story) {
    const popover = await this.modalController.create({
      component: ProjectStoryDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        story,
        projectMembers: this.projectMembers
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {
      console.log("that.onDidDismiss ", resp);

      // Added by Ritika
      if (resp.data?.action == 'delete') {
        this.epicStories.splice(this.epicStories.indexOf(story), 1);
        this.epicStoriesArray = this.epicStories;
        this.selectedStory = [];
        this.storyTasks = [];
        this.epicTasksList.forEach(element => {   /////Added by parul for deleting story from list tab
          if (element.storyId == story.id) {
            this.epicTasksList.splice(this.epicTasksList.indexOf(story), 1);
            this.epicTasksListOriginal.splice(this.epicTasksListOriginal.indexOf(story), 1);

          }
        });
        console.log("taskssss", this.epicTasksList)
      } else {
        this.updateStory(story);
      }

    })
  }

  change_view_mode(mode) {
    this.gantt.change_view_mode(mode)
  }

  assignMember(event: any) {
    console.log(event.target.value);
    let name = event.target.value;
    this.projectMembers1 = name ? this.projectMembers.filter((val: any) => (val.firstName.toLowerCase().includes(name) || val.firstName.toUpperCase().includes(name) || val.firstName.includes(name))) : this.projectMembers;
    console.log('projectMembers1', this.projectMembers1)
  }

  ///Search Employee

  searchEmployee(ev) {
    if ((ev.target.value).length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(resp => {
        this.projectMembers = resp;
        let fieldData
        for (let i = 0; i < this.projectMembers.length; i++) {
          fieldData = this.allUsers.filter(res => res.officialEmail == this.projectMembers[i].officialEmail)[0]
          if (fieldData && fieldData.type)
            this.projectMembers[i].type = fieldData.type
          if (fieldData && fieldData.billable)
            this.projectMembers[i].billable = fieldData.billable
          if (fieldData && fieldData.hoursAssign)
            this.projectMembers[i].hoursAssign = fieldData.hoursAssign
        }
      })
    } else {
      this.projectMembers = this.allUsers;
    }
  }

  checkInTeam(user) {
    let employee = this.allUsers.filter(r => r.employeeId == user.employeeId)
    if (employee.length > 0)
      return false
    else
      return true
  }

  addEmployeeTeam(user) {
    this.allUsers.push(user);
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
    let index = this.allUsers.indexOf(user);
    this.allUsers.splice(index, 1);
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

  selectRole(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      type: user.type
    }
    this.projectService.updateProjectMember(form).then(resp => {
    })
  }

  selectBillable(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      billable: user.billable
    }
    this.projectService.updateProjectMember(form).then(resp => {
    })
  }

  selectHours(user) {
    console.log(user.type)
    let form = {
      memberId: user.id,
      hoursAssign: user.hoursAssign
    }
    this.projectService.updateProjectMember(form).then(resp => {
    })
  }

  // upload docs (Sonali)

  handleFileSelect(file: any) {
    this.files = file.target.files[0];
    console.log(this.files);
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.files) {
      let ExcelSheetdata = new FormData();
      let files = this.files
      let projectId = this.projectId
      ExcelSheetdata.append("files", files);
      ExcelSheetdata.append("projectId", projectId);
      this.commonService.UploadDocs(ExcelSheetdata).subscribe((res) => {
        this.commonService.showToast("success", "File Uploaded")
        this.getDocs();
      },
        (error: any) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
    } else {
      this.commonService.showToast('error', 'Something went wrong')
    }
  }

  // fetch docs (Sonali)

  getDocs() {
    this.commonService.presentLoading();
    this.commonService.getAllDocs({ projectId: this.projectId }).then((res: any) => {
      this.commonService.loadingDismiss();
      console.log(res);
      this.allDocs = res;
      this.responseLength = res.length;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  // Add docs (Sonali)

  async addNote() {
    const popover = await this.modalController.create({
      component: AddNotePage,
      cssClass: 'dsr-preview-modal',
      showBackdrop: true,
      componentProps: { projectId: this.projectId }
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {
      console.log("&&&&&&&&&&&&&&&", resp);
      this.getNotes()
    })
  }

  // fetch notes (Sonali)

  getNotes() {
    this.commonService.presentLoading();
    this.commonService.getAllNotes({ projectId: this.projectId }).then((res: any) => {
      this.commonService.loadingDismiss();
      console.log(res);
      this.allNotes = res;
      console.log("****", this.allNotes)
      this.responseLength = res.length;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  // edit notes (Sonali)

  async editNote(data) {
    const popover = await this.modalController.create({
      component: AddNotePage,
      cssClass: 'dsr-preview-modal',
      showBackdrop: true,
      componentProps: { DATA: data }
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {
      console.log("&&&&&&&&&&&&&&&", resp);
      this.getNotes()
    })
  }

  openDocument(document) {
    let url = this.authService.apiUrl + 'documents/' + document.filename
    window.open(url, '_blank');
  }

  assignTaskNumbers() {
    console.log("assignTaskNumbers ", this.epicTasksListOriginal.length)
    this.epicTasksListOriginal.forEach((task, index) => {
      task['projectTaskNumber'] = index + 1;
      console.log("task ", task['projectTaskNumber'])
      this.updateTask(task)
    })
  }

  gotoCreateSprint() {
    this.sprintSegment = 'new';
    this.segment = 'sprints';
  }

}