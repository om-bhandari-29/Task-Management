import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/Environments/environment';
import { SignupFormData } from '../Models/signup.model';
import { getUserData,notification,response,response3,responseG, responseTask } from '../Generics/GenericResponse';
import { departmentIterable } from '../Models/department.model';
import { deleteDepartResponse } from '../Models/department.model';
import { groupByDepartmentResponse } from '../Models/department.model';
import { Response } from '../Generics/response';
import { Observable } from 'rxjs';
import { LoginFormData } from '../Models/login.model';
import { deletedTaskResponseData, createTaskData, createNewtask } from '../Models/task.model';
import { getAllEmployeeI, user } from '../Models/user.model';
import { taskListModel } from '../Models/task.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  private baseUrl = environment.baseUrl;

  public signup(userData: SignupFormData): Observable<Response>{
    const url = `${this.baseUrl}/api/registration`;
    return this.httpClient.post<Response>(url, userData);
  }

  public signIn(userData: LoginFormData): Observable<responseG<user>>{
    const url = `${this.baseUrl}/api/user/login`;
    return this.httpClient.post<responseG<user>>(url, userData);
  }

  public getUserDetail(): Observable<getUserData<user>>{
    const url = `${this.baseUrl}/api/userDetails`;
    return this.httpClient.get<getUserData<user>>(url);
  }

  public getAllDepartment(): Observable<response<departmentIterable>>{
    const url = `${this.baseUrl}/api/departments`;
    return this.httpClient.get<response<departmentIterable>>(url);
  }

  public addDepartment(newDapart: {departmentName: string}): Observable<{message: string, statusCode: number}>{
    const url = `${this.baseUrl}/api/addDepartment`;
    return this.httpClient.post<{message: string, statusCode: number}>(url, newDapart);
  }

  public deleteDepartmentById(id: number): Observable<deleteDepartResponse> {
    const url = `${this.baseUrl}/api/deleteDepartment/${id}`;
    return this.httpClient.delete<deleteDepartResponse>(url);
  }

  public getDepartmentDetailsByID(id: number){
    const url = `${this.baseUrl}/api/deleteDepartment/${id}`;
  }
  
  public groupByDepartment(): Observable<response<groupByDepartmentResponse>> {
    const url = `${this.baseUrl}/api/GroupByDepartment`;
    return this.httpClient.get<response<groupByDepartmentResponse>>(url);
  }

  // public creteTask(id: number | null, task: createTaskData):Observable<taskListModel> {
  public creteTask(task: createTaskData):Observable<taskListModel> {
    const url = `${this.baseUrl}/api/todo/add`;
    return this.httpClient.post<taskListModel>(url, task);
  }

  public getTaskPerPage(pN: number): Observable<response<taskListModel>>{
    const url = `${this.baseUrl}/api/todo/tasks/${pN}`;
    return this.httpClient.get<response<taskListModel>>(url);
  }
  public deleteTaskById(id: number): Observable<deletedTaskResponseData>{
    const url = `${this.baseUrl}/api/todo/remove/${id}`;
    return this.httpClient.delete<deletedTaskResponseData>(url);
  }

  public getEmployeePerPage(pageN: number): Observable<response<user>>{
    const url = `${this.baseUrl}/api/employees/${pageN}`;
    return this.httpClient.get<response<user>>(url);
  }

  // EMPLOYEE
  public getAllEmployee(data: getAllEmployeeI): Observable<responseTask<user>> {
    const url = `${this.baseUrl}/api/employees`;
    return this.httpClient.post<responseTask<user>>(url, data);
  }

  // TASK
  public creteNewTask(data: createNewtask):Observable<taskListModel> {
    const url = `${this.baseUrl}/api/todo/add`;
    return this.httpClient.post<taskListModel>(url, data);
  }

  public editTaskById(id: number, data: createNewtask): Observable<deleteDepartResponse>{
    const url = `${this.baseUrl}/api/todo/update/${id}`;
    return this.httpClient.put<deleteDepartResponse>(url, data);
  }

  public getAllTask(data: getAllEmployeeI): Observable<responseTask<taskListModel>>{
    const url = `${this.baseUrl}/api/todo/tasks`;
    return this.httpClient.post<responseTask<taskListModel>>(url, data);
  }

  public completeTaskById(id: number, data: {isCompleted: boolean}): Observable<response3>{
    const url = `${this.baseUrl}/api/todo/SetTodoCompleted/${id}`;
    return this.httpClient.post<response3>(url, data);
  }

  public editDetails(id: number, data: any): Observable<response3> {
    const url = `${this.baseUrl}/api/updateuser/${id}`;
    return this.httpClient.put<response3>(url, data);
  }

  public getNotifications(data: any): Observable<response<notification>> {
    const url = `${this.baseUrl}/api/Notification/GetNotifications`;
    return this.httpClient.post<response<notification>>(url, data);
  }
  public markNotificationAsRead(data: any): Observable<response<notification>> {
    const url = `${this.baseUrl}/api/Notification/SetMarkAsRead`;
    return this.httpClient.post<response<notification>>(url, data);
  }
}
