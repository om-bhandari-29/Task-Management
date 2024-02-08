import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { partition } from 'rxjs';
import { getUserData, response } from 'src/app/Generics/GenericResponse';
import { getAllEmployeeI, user } from 'src/app/Models/user.model';
import { createTaskModel, createTaskData, createNewtask, taskListModel } from 'src/app/Models/task.model';
import { AuthService } from 'src/app/Services/auth.service';
import { environment } from 'src/Environments/environment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  constructor(private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService) { }

  public employeeList: user[] = [];
  public showLoader: boolean = true;
  public taskId: number = 0;
  public uId: number | null = null;
  public loggedInUserDepartId: number = -1;
  public loggedInEmployeeType: number = -1;
  public createTaskFormGroup: FormGroup<createTaskModel> = this.initializecreateTaskFormGroup();

  public allEmployeeLlist: user[] = [];

  ngOnInit(): void {

    //for assigning task to an employee
    this.fetchAllEmployee();
    this.uId = parseInt(this.activatedRoute.snapshot.queryParams['id']);
    

    if (localStorage.getItem(environment.employeeType)) {
      let type = localStorage.getItem(environment.employeeType);
      if (type == "SuperAdmin") {
        this.loggedInEmployeeType = 2;
      }
    }

    //for editing task
    this.activatedRoute.params.subscribe((param: Params) => {
      this.taskId = param['id'];
    })
 
    //edit task
    var task = localStorage.getItem("editTask");
    let tname, tdes, tE;
    if (task) {
      const parTask = JSON.parse(task);
      if (parTask.title && parTask.description && parTask.employeeId) {
        tname = parTask.title;
        tdes = parTask.description;
        tE = parTask.employeeId;
        
        
        let edObj = {
          title: tname,
          description: tdes,
          employeeId: tE,
          isCompleted: false
        }
        
        // console.log(edObj);
        
        this.createTaskFormGroup.patchValue(edObj);
      }
    }

    if (this.uId) {
      this.createTaskFormGroup.reset();
      this.createTaskFormGroup.controls['employeeId'].setValue(this.uId);
      this.createTaskFormGroup.controls['employeeId'].disable();
    }
    this.showLoader = false;
  }

  public submit() {
    this.createTaskFormGroup.markAllAsTouched();
    if (this.uId && this.createTaskFormGroup.valid) {
      this.showLoader = true;
      let newTask: createNewtask = {
        title: this.createTaskFormGroup.controls.title.value,
        description: this.createTaskFormGroup.controls.description.value,
        isCompleted: false,
        employeeId: this.createTaskFormGroup.controls.employeeId.value
      }
      this.auth.creteNewTask(newTask).subscribe({
        next: (res: any) => {
          this.createTaskFormGroup.reset();
          this.showLoader = false;
          if (res.statusCode == 0) {
            this.toastrService.success("Task Assigned Successfully");
          }
          this.router.navigate(['/portal/myTasks'], {queryParams: {page: 1, search: '', take: 5, taskStatus: null}});
        },
        error: (err) => {
          console.log(err);
        }
      });

      return;
    }

    this.createTaskFormGroup.markAllAsTouched();
    if (this.createTaskFormGroup.valid) {
      this.showLoader = true;
      let comPl = this.createTaskFormGroup.controls.isCompleted.value;
        let newTask: createNewtask = {
          title: this.createTaskFormGroup.controls.title.value,
          description: this.createTaskFormGroup.controls.description.value,
          isCompleted: comPl,
          employeeId: this.createTaskFormGroup.controls.employeeId.value
        }

      //edit task
      if (this.taskId) {
        this.auth.editTaskById(this.taskId, newTask).subscribe({
          next: () => {
            this.createTaskFormGroup.reset();
            this.toastrService.success("Task Updated Successfully");
            this.router.navigate(['/portal/myTasks'], {queryParams: {page: 1, search: '', take: 5, taskStatus: null}});
            // this.router.navigate(['../../myTasks'],
            //   {
            //     relativeTo: this.activatedRoute,
            //     queryParams: { page: 1, search: '', take: 5}
            //   }
            // )
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    }

  }


  public fetchAllEmployee() {
    const allEmp: getAllEmployeeI = {
      isPagination: false,
      index: 0,
      take: 0,
      search: null,
      orders: null,
      orderBy: null
    }
    this.auth.getAllEmployee(allEmp).subscribe({
      next: (res: response<user>) => {
        res.iterableData.map(
          (emp: user) => {
            this.allEmployeeLlist.push(emp);
          }
        )
      },

      error: (err) => {
        console.log(err);
      }
    })
  }


  public initializecreateTaskFormGroup() {
    return new FormGroup<createTaskModel>({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      isCompleted: new FormControl(false),
      employeeId: new FormControl(null, Validators.required)
    })
  }

}
