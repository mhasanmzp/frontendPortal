import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectSprintDetailsPage } from '../../modals/project-sprint-details/project-sprint-details.page';
import { Router } from '@angular/router';
import { ProjectChartListPage } from 'src/app/modals/project-chart-list/project-chart-list.page';
import { number } from 'echarts';

@Component({
  selector: 'app-project-sprints',
  templateUrl: './project-sprints.component.html',
  styleUrls: ['./project-sprints.component.scss'],
})
export class ProjectSprintsComponent implements OnInit {
  @Input() epicTasksListOriginal = [];
  @Input() projectMembers = [];
  @Input() teamBoardColumns: any = [];
  @Input() storyTasks = [];
  @Input() projectId: any;
  @Input() epicTasksList = [];
  @Input() epicStories = [];
  @Input() selectedStory: any = {};
  @Input() selectedTasks: any = {};
  @Input() sprintSegment: any;
  selectedSprintTasks: any = [];
  estimatedHours: any = 0;
  actualHours: any = 0;
  sprintTasks = [];
  activeSprints: any = [];
  pastSprints: any = [];
  segment: any = 'ongoing';
  inActiveSprints: any = [];
  sprintTasksAssignment: any = {};
  sprintTasksAssignmentIds: any = [];
  newSprint: any = {};
  holdPercentage: any;
  donePercentage: any;
  inProgressPercentage: any;
  testingPercentage: any;
  pendingPercentage: any;
  totalHoursSpent: number;
  totalEstimatedHours = 0;

  constructor(
    public commonService: CommonService,
    private router: Router,
    public authService: AuthService,
    public projectService: ProjectService,
    public modalController: ModalController,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.selectedSprintTasks = this.epicTasksListOriginal.filter(t => {
    //   return this.sprintTasks.indexOf(t.taskId) > -1
    // })
    // this.estimatedHours = 0;
    // this.selectedSprintTasks.forEach(task => {
    //   this.estimatedHours += task.estimatedHours
    // })
    const sprint = {}; // Add the necessary data for the 'sprint' object
    const filteredTasks = this.getTasks(sprint);
    // this.totalHoursSpent = this.calculateTotalHoursSpent(filteredTasks);

    if (this.sprintSegment) {
      this.segment = this.sprintSegment;
      // this.sprintSegment = null;
    } else {
      // this.segment = 'ongoing';
    }

    // this.estimatedHours = parseFloat(this.estimatedHours).toFixed(2);
    this.changeSprint(sprint);
    this.getSprints();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  sprintSegmentChanged() {
    // this.segment = 'ongoing';
  }

  // tarun tomar----

  getSprintEstimatedHours(sprint) {
    let estimatedHours = 0;
    let tasks = this.getTasks(sprint);

    tasks.forEach((task) => {
      estimatedHours += task.estimatedHours;
    });

    return estimatedHours;
  }

  changeSprint(sprint) {
    // Reset estimated and actual hours
    this.estimatedHours = 0;
    this.actualHours = 0;

    // Calculate estimated hours and update selected tasks
    this.estimatedHours = this.getSprintEstimatedHours(sprint);
    this.selectedSprintTasks = this.epicTasksList.filter(
      (e) => e['checkedForSprint'] == true
    );

    // Populate sprintTasks array
    this.selectedSprintTasks.forEach((task) => {
      this.sprintTasks.push(parseInt(task.taskId));
    });

    // Initialize or reset sprintTasksAssignment
    this.sprintTasksAssignment = {};

    // Calculate sprintTasksAssignment and update estimated and actual hours
    this.selectedSprintTasks.forEach((task) => {
      if (!this.sprintTasksAssignment[task.assignee]) {
        this.sprintTasksAssignment[task.assignee] = 0;
      }
      this.sprintTasksAssignment[task.assignee] += task.estimatedHours;
      this.estimatedHours += task.estimatedHours;
      this.actualHours += task.actualHours;
    });

    // Update sprintTasksAssignmentIds
    this.sprintTasksAssignmentIds = Object.keys(this.sprintTasksAssignment);
  }

  getSprints() {
    this.projectService.getInactiveSprints(this.projectId).then((data) => {
      this.inActiveSprints = data;
      // console.log(this.inActiveSprints);
    });
    this.projectService.getActiveSprints(this.projectId).then((data) => {
      this.activeSprints = data;
      // console.log(this.activeSprints);
    });
    this.projectService.getPastSprints(this.projectId).then((data) => {
      this.pastSprints = data;
    });
  }

  // getSprintAssignees(sprint) {
  //   // Initialize variables
  //   let sprintTasksAssignment = {};
  //   let tasks = this.getTasks(sprint);

  //   // Calculate estimated hours and populate sprintTasksAssignment
  //   tasks.forEach(task => {
  //     if (!sprintTasksAssignment[task.assignee]) {
  //       sprintTasksAssignment[task.assignee] = 0;
  //     }
  //     sprintTasksAssignment[task.assignee] += task.estimatedHours;
  //   });

  //   // Update sprint properties
  //   sprint['sprintTasksAssignment'] = sprintTasksAssignment;
  //   sprint['estimatedHours'] = this.getSprintEstimatedHours(sprint);
  //   sprint['actualHours'] = 0;  // Assuming actualHours will be updated elsewhere

  //   // Return assignees
  //   return Object.keys(sprintTasksAssignment);
  // }
  getSprintActualHours(sprint) {
    let actualHours = 0;
    for (const assignee in sprint.sprintTasksAssignment) {
      if (sprint.sprintTasksAssignment.hasOwnProperty(assignee)) {
        actualHours += sprint.sprintTasksAssignment[assignee].actualHours;
      }
    }
    return actualHours;
  }
  getSprintAssignees(sprint) {
    // Initialize variables
    let sprintTasksAssignment = {};
    let tasks = this.getTasks(sprint);

    // Calculate estimated and actual hours and populate sprintTasksAssignment
    tasks.forEach((task) => {
      if (!sprintTasksAssignment[task.assignee]) {
        sprintTasksAssignment[task.assignee] = {
          estimatedHours: 0,
          actualHours: 0,
        };
      }
      sprintTasksAssignment[task.assignee].estimatedHours +=
        task.estimatedHours;
      sprintTasksAssignment[task.assignee].actualHours += task.actualHours;
    });

    // Update sprint properties
    sprint['sprintTasksAssignment'] = sprintTasksAssignment;
    sprint['estimatedHours'] = this.getSprintEstimatedHours(sprint);
    sprint['actualHours'] = this.getSprintActualHours(sprint);

    // Return assignees
    return Object.keys(sprintTasksAssignment);
  }

  calculateHoldCount(tasks: any[]): number {
    return tasks.filter((task) => task.onHold).length;
  }

  getTasks(sprint) {
    // debugger;
    if (!sprint || !sprint['tasks'] || !Array.isArray(sprint['tasks'])) {
      // Handle the case where 'sprint.tasks' is not defined or not an array
      return [];
    }

    let filteredTasks = this.epicTasksListOriginal.filter((t) => {
      return sprint['tasks'].indexOf(t.taskId) > -1;
    });
    // console.log(filteredTasks);
    let holdCount = this.calculateHoldCount(filteredTasks),
      doneCount = 0,
      inProgressCount = 0,
      testingCount = 0,
      pendingCount = 0,
      totalHoursSpent = 0;
    // Initialize the variable to hold the total hours spent

    filteredTasks.forEach((ele) => {
      if (ele.onHold === true) {
        holdCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Done') {
        doneCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'In Progress') {
        inProgressCount++;
        totalHoursSpent += ele.totalHoursspent;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Testing') {
        testingCount++;
      } else {
        pendingCount++;
      }

      // Assuming "totalHoursspent" is the field containing total hours spent for each task
      // Add total hours spent to the variable
      this.totalHoursSpent += ele.totalHoursSpent;
    });

    this.holdPercentage = ((holdCount / filteredTasks.length) * 100).toFixed(2);
    this.inProgressPercentage = (
      (inProgressCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.donePercentage = ((doneCount / filteredTasks.length) * 100).toFixed(2);
    this.testingPercentage = (
      (testingCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.pendingPercentage = (
      (pendingCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.totalHoursSpent = totalHoursSpent;

    // Save the total hours spent in a class property
    return filteredTasks;
  }

  updateSprint(sprint) {
    this.projectService.updateSprint(sprint).then(
      (resp: any) => {
        //console.log("result",resp)
        this.getSprints();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  getDaysRemaining(sprint) {
    var date1 = new Date();
    var date2 = new Date(sprint.dueDate);
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.ceil(Difference_In_Days);
    // return Math.floor(Difference_In_Days);
  }

  async viewSprintDetails(sprint) {
    const popover = await this.modalController.create({
      component: ProjectSprintDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
        sprint,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      this.updateSprint(sprint);
    });
  }

  async viewTaskDetails(item, story) {
    const popover = await this.modalController.create({
      component: ProjectTaskDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        item,
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      //console.log(resp);
      if (resp.data?.action == 'delete') {
        ////Added by Parul
        this.storyTasks.splice(this.storyTasks.indexOf(item), 1);
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(
                this.selectedStory.columnTasks[i].tasks.indexOf(item),
                1
              );
            }
          });
        });
        this.epicTasksList.forEach((element) => {
          /////Added by parul for deleting task from list tab
          if (element.taskId == item.taskId) {
            this.epicTasksList.splice(this.epicTasksList.indexOf(item), 1);
            this.epicTasksListOriginal.splice(
              this.epicTasksListOriginal.indexOf(item),
              1
            );
          }
        });
        //console.log("this.epic", this.epicStories, this.selectedStory, this.epicTasksList)
      }
      if (resp.data?.status == 1 && story == null) {
        //console.log("story", this.selectedStory, item)
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(
                this.selectedStory.columnTasks[i].tasks.indexOf(item),
                1
              );
            }
          });
        });
        for (let i = 0; i < this.selectedStory.columnTasks.length; i++) {
          if (this.selectedStory.columnTasks[i].columnId == item.columnId) {
            this.selectedStory.columnTasks[i].tasks.push(item);
          }
        }
        this.updateTask(item);
        //console.log("task", this.selectedStory, this.storyTasks)
        // var task = this.selectedStory.columnTasks.filter(id=>id.columnId == item.columnId)[0]
        // task.tasks()
      }
      if (resp.data?.status == 1 && story) {
        //console.log("task", story, item)
        story.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              story.columnTasks[i].tasks.splice(
                story.columnTasks[i].tasks.indexOf(item),
                1
              );
            }
          });
        });
        for (let i = 0; i < story.columnTasks.length; i++) {
          if (story.columnTasks[i].columnId == item.columnId) {
            story.columnTasks[i].tasks.push(item);
          }
        }
        this.updateTask(item);
        //console.log("task", this.selectedStory, this.storyTasks)
        // var task = this.selectedStory.columnTasks.filter(id=>id.columnId == item.columnId)[0]
        // task.tasks()
      }
      if (resp.data?.action == 'update') {
        this.updateTask(item);
      } else {
        // //console.log("itemsss", item)
        // this.updateTask(item);
      }
    });
  }

  getTeamBoardColumns(columnId) {
    // //console.log("this.teamBoardColumns ", this.teamBoardColumns)
    // //console.log("this.columnId ", columnId)
    // //console.log("==========================")
    let column = this.teamBoardColumns.filter(
      (column) => column.columnId == columnId
    );
    return column[0].columnName;
  }

  getListAssigneeDetails(item, key, data) {
    if (item) {
      let user = this.projectMembers.filter((e) => e.employeeId == item[key]);
      if (user.length > 0) return user[0][data] || '';
      else return '';
    } else {
      return '';
    }
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.projectService.updateProjectTask(task).then((resp: any) => {});
  }

  createSprint() {
    // console.log(this.newSprint);
    this.newSprint['tasks'] = this.sprintTasks;
    this.newSprint['projectId'] = this.projectId;
    // this.newSprint['SprintPlannedType'] = 'Initial';

    this.projectService.createSprint(this.newSprint).then(
      (resp: any) => {
        this.commonService.showToast(
          'success',
          'New Sprint created successfully!'
        );
        this.newSprint = {};
        this.selectedSprintTasks = [];
        this.sprintTasks = [];
        this.selectedTasks = {};
        this.epicTasksList.forEach((e) => (e['checkedForSprint'] = false));
        this.sprintSegment = 'ongoing';
        this.segment = 'ongoing';
        this.getSprints();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  async addTask(sprint) {
    const popover = await this.modalController.create({
      component: ProjectChartListPage,
      cssClass: 'dsr-preview-modal',
      componentProps: {
        projectMember: this.projectMembers,
        teamBoardColumn: this.teamBoardColumns,
        taskList: JSON.parse(JSON.stringify(this.epicTasksListOriginal)),
        flag: 'addTask',
        sprint,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      this.getSprints();
    });
  }

  removeSprintTask(epic, sprint) {
    let task = sprint.tasks.filter((e) => e !== epic);
    // console.log(task)
    let form = {
      sprintId: sprint.sprintId,
      tasks: task,
    };
    this.projectService.updateSprint(form).then(
      (resp: any) => {
        if (resp) {
          this.getSprints();
        }
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  downloadSprint(sprint) {
    this.projectService.downloadSprint(sprint);
  }
}
