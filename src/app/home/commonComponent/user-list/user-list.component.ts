import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { response } from 'src/app/Generics/GenericResponse';
import { getAllEmployeeI, user } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router){}

  public allEmployeeList: user[] = [];
  public showLoader: boolean = true;
  public isDepartEmployeeRoute: boolean = false;
  public departID: number = -1;
  public departmentId: number | null = -1;

  public lEmployeeType: string | null = "";
  public isEmployee: boolean = false;
  
  public userListM: getAllEmployeeI = {
    isPagination: false,
    index: 0,
    take: 0,
    search: null,
    orders: null,
    orderBy: null
  }

  ngOnInit(): void {

    if(localStorage.getItem("loggedInUser_EmployeeType")){
      this.lEmployeeType = localStorage.getItem("loggedInUser_EmployeeType")
      if(this.lEmployeeType == "Employee"){
        this.isEmployee = true;     
      }
    }
    if(localStorage.getItem("departId")){
      let dp = localStorage.getItem("departId")
      if(dp){
        this.departmentId = parseInt(JSON.parse(dp));            
      }
    }

    this.activatedRoute.params.subscribe(
      (param: Params) =>{
        if(param['id']){

          this.departID = parseInt(param['id']);
          this.isDepartEmployeeRoute = true;
          this.showLoader = true;

          this.auth.getAllEmployee(this.userListM).subscribe({
            next: (res: response<user>) =>{
              this.showLoader = false;
              
              this.allEmployeeList = [];
              // console.log(res.iterableData);
              
              res.iterableData.map(
                (emp: user) =>{                  
                  if(emp.departmentID == this.departID){
                    this.allEmployeeList.push(emp);             
                  }
                }
              )
            },
      
            error: (err) =>{
              console.log(err);
            }
          })
        }
      }
    )

    if(!this.isEmployee && this.departID == -1){
      this.auth.getAllEmployee(this.userListM).subscribe({
        next: (res: response<user>)=>{
          this.allEmployeeList = [];
          // console.log(res.iterableData);
          this.allEmployeeList = res.iterableData;
          this.showLoader = false;
        },
  
        error: (err)=>{
          console.log(err);
        }
      })
    }
  }

  public assignTask(emp: user){
    this.router.navigate(['/portal/assignTask'], {queryParams: {id: emp.id}});
  }
  
}
