import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
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

    getUserTeams(){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'getUserTeams',{userId: this.authService.userId},{headers:this.header}).subscribe((resp: any) => {
            console.log("rsp",resp)
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    fetchTeamColumns(teamId){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'fetchTeamColumns',{ teamId },{headers:this.header}).subscribe((resp: any) => {
            console.log("rsp",resp)
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    updateTask(task){
      return new Promise((resolve, reject) => {
        task.organisationId = this.authService.organisationId;
        this.http.post(this.authService.apiUrl + 'updateTask',task,{headers:this.header}).subscribe((resp: any) => {
            console.log("rsp",resp)
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    createTask(task){
      return new Promise((resolve, reject) => {
        task.organisationId = this.authService.organisationId;
        task.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'createTask',task,{headers:this.header}).subscribe((resp: any) => {
            console.log("rsp",resp)
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    getUserTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'getUserTasks',column,{headers:this.header}).subscribe((resp: any) => {
            // console.log("rsp",resp)
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    deleteUserTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'deleteTask',column,{headers:this.header}).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    deleteStoryTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'deleteStoryTask',column,{headers:this.header}).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    filterDsr(params){
      return new Promise((resolve, reject) => {
        params.organisationId = this.authService.organisationId;
        // if(!params.employeeIds)
        // params.employeeIds = [this.authService.userId];
        // params.employeeIds = [4,9,31];
        this.http.post(this.authService.apiUrl + 'filterDsr',params,{headers:this.header}).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }
  
    getTasksDsr(data){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'getTasksforDsr',data,{headers:this.header}).subscribe((resp:any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    requestTicket(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'requestTicket',data,{headers:this.header}).subscribe((resp:any)=>{
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    getAllTicketsuser(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'getAllTicketsforuser',data,{headers:this.header}).subscribe((resp:any)=>{
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }
    
    getAllTicketsManager(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'getAllTicketsforManager',data,{headers:this.header}).subscribe((resp:any)=>{
          resolve(resp)
        }, error=>{
          reject(error)
        })
      })
    }

    actionTicketbyManager(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'actionTicketbyProjectManager',data,{headers:this.header}).subscribe((resp:any)=>{
          resolve(resp)
        }, error =>{
          reject(error)
        })
      })
    }
}
