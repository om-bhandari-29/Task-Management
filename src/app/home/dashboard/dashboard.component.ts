import { Component, OnInit } from '@angular/core';
import { environment } from 'src/Environments/environment';
import { response, responseTask } from 'src/app/Generics/GenericResponse';
import { departmentIterable } from 'src/app/Models/department.model';
import { taskListModel } from 'src/app/Models/task.model';
import { getAllEmployeeI, getAllTaskI, user } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthService){}

  public showLoaderE: boolean = true;
  public showLoaderT: boolean = true;
    
  public employeeType: string | null = "Admin";
  public isEmployee: boolean = false;
  
  public departmentCount: number = 0;
  public taskCount: number = 0;
  public employeeCount: number = 0;

  public filterTask: getAllTaskI = {
    isPagination: false,
    index: 0,
    take: 5,
    search: "",
    orders: 1,
    orderBy: "id",
    isCompleted: null
  }

  public userListM: getAllEmployeeI = {
    isPagination: false,
    index: 0,
    take: 5,
    search: null,
    orders: null,
    orderBy: null
  }
  
  ngOnInit(): void {
    if(localStorage.getItem("loggedInUser_EmployeeType")){
      this.employeeType = localStorage.getItem("loggedInUser_EmployeeType")
      if(this.employeeType == "Employee"){
        this.isEmployee = true;     
      }
    }
    
    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: responseTask<taskListModel>) =>{
        this.taskCount = res.count;
        this.showLoaderT = false;
      },
      error: (err) =>{
        console.log(err);
      }
    });

    if(this.employeeType=="SuperAdmin" || this.employeeType=="Admin"){
      this.auth.getAllDepartment().subscribe({
        next: (res: response<departmentIterable>) =>{
          this.departmentCount = res.iterableData.length;
          this.showLoaderE = false;
        },
        error: (err) =>{
          console.log(err);
        }
      });
      
  
      this.auth.getAllEmployee(this.userListM).subscribe({
        next: (res: response<user>)=>{
          this.employeeCount = res.iterableData.length;
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }
    

    let emptype = localStorage.getItem(environment.employeeType);
    
    if(emptype){
      this.employeeType = emptype;
    }
  }
}
