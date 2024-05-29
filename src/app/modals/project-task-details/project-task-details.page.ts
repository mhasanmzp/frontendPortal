import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-task-details',
  templateUrl: './project-task-details.page.html',
  styleUrls: ['./project-task-details.page.scss'],
})
export class ProjectTaskDetailsPage implements OnInit {
  @Input() item: any;
  @Input() projectMembers: any;
  @Input() teamBoardColumns: any;
  @Input() enableFields: any;
  status: any = 0;
  currentStatus: any;
  taskStatus: any;
  taskPriorities: any = [{
    id: 0, name: 'Low'
  }, {
    id: 1, name: 'Medium'
  }, {
    id: 2, name: 'High'
  }, {
    id: 3, name: 'On Hold'
  }];
  taskType: any = [{
    id: 0, name: 'Feature'
  }, {
    id: 1, name: 'Bug'
  },
  {
    id: 2, name: 'Demo'
  }];
  category: any = [{
    id: 0, name: 'Other'
  }, {
    id: 1, name: 'Frontend'
  }, {
    id: 2, name: 'Backend'
  }, {
    id: 3, name: 'SAP'
  }]
  members: any = [];
  assignMemberId: any;
  requestComment: any;
  requestedTicket: boolean = false;
  task: any = []

  constructor(
    public modalController: ModalController, private alertController: AlertController,
    private tasksService: TasksService, private commonService: CommonService, private router: Router
  ) { }

  ngOnInit() {
    this.item.showField = true;
    let userId = localStorage.getItem('userId');
    console.log('userID', userId)
    if (!this.item.tester) {
      this.item.tester = 0
    }
    if (!this.item.category) {
      this.item.category = 0
    }
    this.members = JSON.parse(JSON.stringify(this.projectMembers))
    // console.log(this.members)
    this.currentStatus = this.teamBoardColumns.filter(c => c.columnId == this.item.columnId)[0]['columnName']
    // console.log("this.currentStatus ", this.currentStatus)
    console.log('item', this.item)
    this.members.unshift({
      employeeId: 0,
      firstName: 'Not Assigned'
    });

    this.members.forEach(element => {
      if (element.type == 'Manager' && element.employeeId == userId) {
        console.log("Manager")
        this.item.showField = false
      }
    });

    this.task = JSON.parse(JSON.stringify(this.item));
  }

  ionViewWillLeave() {
    if (this.status == 1) {
      if (this.taskStatus == 'Done') {
        this.setCompletionDate();
      }
      if (this.currentStatus == 'Done' && this.taskStatus == 'To Do') {
        this.item.status = 0;
        this.item.completionDate = null;
        this.item.reOpened = true;

      }
    }
    this.modalController.dismiss({ status: this.status });
  }

  onHoldChanged() {
    if (this.item.onHold) {
      this.item.priority = 3;
      this.item.columnId = this.teamBoardColumns[4].columnId;
    } else {
      this.item.priority = 0;
      this.item.columnId = this.teamBoardColumns[0].columnId;
    }
  }

  assignTaskOverlay(item, i) {
    // if (!this.enableFields) {
    //   item.isOpen = !item.isOpen
    //   item.index = i;
    // }
    item.isOpen = !item.isOpen
    item.index = i;
  }

  assignMember(event: any) {
    console.log(event.target.value);
    let name = event.target.value;
    this.projectMembers = name ? this.projectMembers.filter((val: any) => (val.firstName.toLowerCase().includes(name) || val.firstName.toUpperCase().includes(name) || val.firstName.includes(name))) : this.projectMembers;
    console.log('projectMembers1', this.projectMembers)
  }

  assignTask(item, user) {
    if (item.assignee != user.employeeId)
      item['assigneeUpdated'] = true;
    item.assignee = user.employeeId;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    item.image = user.image;
    item.isOpen = !item.isOpen;
    this.assignMemberId = user.employeeId
    // this.updateTask(item);
  }

  async deleteTask() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this task.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.tasksService.deleteStoryTasks(this.item).then((resp: any) => {
              if (resp.status == true) {
                this.modalController.dismiss({ item: this.item, action: 'delete' });
              }
            }, error => {
              this.commonService.showToast('error', error.error.msg);
              if (error.error.statusCode == 401) {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigateByUrl('/login')
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  close() {
    this.modalController.dismiss({ status: this.status, action: 'update' });
  }

  getAssigneeDetails(item, data) {
    let user = this.projectMembers.filter(e => e.employeeId == item.assignee);
    if (user.length > 0) {
      this.assignMemberId = user;
      return user[0][data] || ''
    } else
      return ''
  }

  getReporterDetails(item, data) {
    let user = this.projectMembers.filter(e => e.employeeId == item.reporter);
    if (user.length > 0)
      return user[0][data] || ''
    else
      return ''
  }

  statusChange(ev) {
    console.log(ev.target.value)
    if (this.assignMemberId) {
      this.taskStatus = this.teamBoardColumns.filter(c => c.columnId == ev.target.value)[0]['columnName']
      this.status = 1;
      if (this.taskStatus == 'Hold') {
        this.item.priority = 3;
        this.item.onHold = true;
      } else {
        // this.item.priority = 0;
        this.item.onHold = false;
      }
    } else {
      this.item.columnId = this.teamBoardColumns.filter(c => c.columnName == 'To Do')[0]['columnId'];
      ev.target.value = this.item.columnId
      console.log(this.item.columnId)
      this.taskStatus = 'To Do';
      // this.commonService.showToast('error', 'Please assign someone')
    }
  }

  setCompletionDate() {
    console.log("setCompletionDate")
    this.item.status = 1
    this.item.completionDate = new Date();
  }

  changeDate() {
    if (this.item.startDate > this.item.dueDate) {
      this.commonService.showToast("error", "Due date should be greater than start date.")
      this.item.dueDate = this.item.startDate
    }
    if (this.item.testingStartDate > this.item.testingDueDate) {
      this.commonService.showToast("error", "Testing due date should be greater than testing start date.")
      this.item.testingDueDate = this.item.testingStartDate
    }
  }

  async sendRequest() {
    const alert = await this.alertController.create({
      header: 'Request Comment!',
      inputs: [
        {
          name: 'requestComment',
          type: 'textarea',
          placeholder: 'Enter comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        },
        {
          text: 'Send',
          handler: (taskData) => {
            let task = {}

            task['projectId'] = this.item.projectId
            task['taskId'] = this.item.projectTaskNumber
            task['taskName'] = this.item.taskName
            task['requestdBy'] = localStorage.getItem('userId')
            task['status'] = this.item.status
            task['requestComment'] = taskData.requestComment

            console.log('task', task);

            if (task['requestComment']) {
              this.tasksService.requestTicket(task).then((res: any) => {
                console.log(res)
                if (res.requestId) {
                  this.requestedTicket = true;
                }
              })
            } else {
              this.commonService.showToast('error', 'Please fill all fields')
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
