import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  token:any;
  header:any;
  jwt_token: any;

  constructor(
    public authService: AuthService,
    public http: HttpClient
  ) {
    // this.token = localStorage.getItem('token')
    // this.header = new HttpHeaders().set('jwtToken', this.token)
    this.jwt_token=localStorage.getItem('jwt_token');
    this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
   }

  createProject(projectObject) {
    projectObject.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createProject', projectObject,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  updateProject(projectObject) {
    projectObject.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'updateProject', projectObject,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getOneProject(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getOneProject', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getProjectMembers(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getProjectMembers', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  addProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'addProjectMember', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  removeProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'removeProjectMember', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  updateProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'updateProjectMember', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  fetchAllProjects(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'fetchAllProjects', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getMemberProjects() {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getMemberProjects', { employeeId: this.authService.userId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getTeamsReporting() {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getTeamsReporting', { userId: this.authService.userId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  createEpic(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createEpic', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  updateProjectEpic(epicData) {
    let newEpic = Object.assign(epicData);
    // console.log("updateProjectEpic epicData ", epicData)
    // console.log("updateProjectEpic newEpic ", newEpic)
    if (typeof newEpic.id != 'number')
      newEpic['id'] = newEpic.id.replace('epic', '')
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'epicUpdate', newEpic,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getProjectEpics(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getProjectEpics', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  deleteProjectEpics(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'deleteEpic', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }), error => {
        reject(error)
      }
    })
  }

  createStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createStory', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  updateEpicStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'storyUpdate', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getEpicStories(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getStories', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  deleteEpicStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'deleteStory', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }), error => {
        reject(error)
      }
    })
  }

  createStoryTask(taskData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createStoryTask', taskData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }


  getStoryTasks(epicData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getStoryTasks', epicData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }


  getProjectColumns(projectData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getProjectColumns', projectData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  updateProjectTask(task) {
    return new Promise((resolve, reject) => {
      task.organisationId = this.authService.organisationId;
      this.http.post(this.authService.apiUrl + 'updateProjectTask', task,{headers:this.header}).subscribe((resp: any) => {

        // this.authService.socket.emit('new message', JSON.stringify(task));

        // console.log("rsp", resp)
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  // updateProjectEpic(epicData){
  //   return new Promise((resolve, reject) => {
  //     this.http.post(this.authService.apiUrl + 'epicUpdate', epicData,{headers:this.header}).subscribe((resp: any) => {
  //       resolve(resp)
  //     }, error => {
  //       reject(error)
  //     })
  //   })
  // }

  fetchAllDocs(paramsData) {
    paramsData.employeeId = this.authService.employeeId;
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getoneEmployeeDocument', paramsData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  createSprint(taskData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createSprint', taskData,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }


  getActiveSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getActiveSprints', { projectId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  

  getInactiveSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getInactiveSprints', { projectId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getPastSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getPastSprints', { projectId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  updateSprint(sprint) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'updateSprint', sprint,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getAllProjectReport(data){
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'getAllProjectReport', data,{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getAllProjectHrs(){
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http.post(this.authService.apiUrl + 'getAllProjectHrs', { organisationId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  getallprojectDetails(){
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http.post(this.authService.apiUrl + 'getallprojectwholedetails', { organisationId },{headers:this.header}).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  downloadSprint(sprint){
    window.location.assign(this.authService.apiUrl+'downloadSprint'+'?sprintId='+sprint.sprintId+'&tasks='+sprint.tasks)
  }

 


}
