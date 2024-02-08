import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { response, responseTask } from 'src/app/Generics/GenericResponse';
import { createNewtask, createTaskModel, deletedTaskResponseData } from 'src/app/Models/task.model';
import { taskListModel } from 'src/app/Models/task.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { getAllEmployeeI, getAllTaskI, user } from 'src/app/Models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  constructor(private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) { }

  public showLoader: boolean = true;
  public showError: boolean = false;

  public allTaskList: taskListModel[] = [];
  public allEmployeeLlist: user[] = [];
  public allIncompletedTask: taskListModel[] = [];

  public isCreatetask: boolean = false;
  public hideCreateString: string = "Create task";
  public isEditTask: boolean = false;

  public editBtnIsClicked: boolean = false;
  public isEmployee: boolean = false;
  public isShowCompletedTask: boolean = false;
  public loggedInEmployeeType: number = -1;
  public createTaskFormGroup: FormGroup<createTaskModel> = this.initializecreateTaskFormGroup();

  public currentPage: number = 0;
  public errMsg: string = "";
  public errCode: number = 0;

  public page: number = 0;
  public searchString: string = "";
  public take: number = 0;

  public searchWord: string = "";
  public totalRecords: number = 0;
  public totalPages: number = 0;

  public currentPageSets: number[] = [];

  public isNextExists: boolean = true;
  public isPreviousExists: boolean = true;

  public isTitleAsscending: boolean = false;
  public isTitleDescending: boolean = false;
  public isDescriptionAsscending: boolean = false;
  public isDescriptionDescending: boolean = false;

  public isNextSetBtnExists: boolean = false;
  public isPreviousSetBtnExists: boolean = false;


  public filterTask: getAllTaskI = {
    isPagination: true,
    index: 0,
    take: 5,
    search: "",
    orders: 1,
    orderBy: "id",
    isCompleted: null
  }

  public employeeType: string | null = "";

  ngOnInit(): void {

    if (localStorage.getItem("loggedInUser_EmployeeType")) {
      this.employeeType = localStorage.getItem("loggedInUser_EmployeeType")
      if (this.employeeType == "Employee") {
        this.isEmployee = true;
      }
    }

    this.showLoader = true;
    this.allEmployeeLlist = [];
    this.currentPage = this.currentPage + 1;

    if (!this.isEmployee) {
      this.fetchAllEmployee();
    }

    this.activatedRoute.queryParams.subscribe(
      (param: Params) => {
        let pageTemp = param['page'];
        this.page = parseInt(pageTemp);

        let tempTak = param['take'];
        this.take = parseInt(tempTak);

        this.searchString = param['search'];

        if (param['taskStatus'] == null || param['taskStatus'] == "")
          this.filterTask.isCompleted = null;
        else {
          this.filterTask.isCompleted = (param['taskStatus'] == "true") ? true : false;
          // this.filterTask.isCompleted = param['taskStatus'];
        }

        this.filterTask.index = this.page - 1;
        this.filterTask.search = this.searchString;
        this.filterTask.take = this.take;
        this.fetchAllTask();
      }
    )

    this.activatedRoute.params.subscribe(
      (param: Params) =>{
        // console.log(param);
        if(param['id']){
          this.isEditTask = true;
        }
        // console.log("this.isEditTask : ", this.isEditTask);
        
      }
    )
  }


  public deleteTask(taslId: number) {
    if (confirm("Are you want to delete ?")) {
      this.auth.deleteTaskById(taslId).subscribe({
        next: (res: deletedTaskResponseData) => {
          this.toastrService.success("Task Deleted Successfully");
          this.filterTask.index = 0;
          this.currentPage = 0;
          this.ngOnInit();
        },
        error: (err) => {
          // console.log(err);
          alert(`${err.statusText}`);
        }
      })
    }
  }

  public editTask(task: any) {
    const taskL = {
      title: task.title,
      description: task.description,
      employeeId: task.employeeId
    }

    localStorage.setItem("editTask", JSON.stringify(taskL));
    // this.router.navigate([`/myTasks/edit/${task.id}`]);
    this.router.navigate([`/portal/myTasks/${task.id}`]);
  }

  public completeTaskBtn(task: any) {
    const com = {
      isCompleted: true
    }
    this.auth.completeTaskById(task.id, com).subscribe({
      next: (res: any) => {
        this.ngOnInit();
      },

      error: (err) => {
        console.log(err);
      }
    })
  }

  public markIncomplete(task: any) {
    const undoTask = {
      isCompleted: false
    }

    this.auth.completeTaskById(task.id, undoTask).subscribe({
      next: (res) => {
        this.ngOnInit();
      },

      error: (err) => {
        alert(err.message)
      }
    })
  }

  public showMore(showMoreCon: HTMLParagraphElement, btnId: HTMLButtonElement) {
    showMoreCon.style.display = "block"
    btnId.hidden = true;
  }

  public showLess(showMoreCon: HTMLParagraphElement, showMoreBtn: HTMLButtonElement) {
    showMoreCon.style.display = "none";
    showMoreBtn.hidden = false;
  }

  public fetchAllTask() {
    this.showLoader = true;
    // console.log(this.filterTask.isCompleted);

    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: responseTask<taskListModel>) => {
        this.allTaskList = res.iterableData;
        // console.log(res.iterableData);

        // this.totalRecords = res.iterableData.length;
        this.totalRecords = res.count;

        this.isPreviousExists = false;
        this.totalPages = Math.ceil(this.totalRecords / this.filterTask.take);

        if (this.page > 0 && this.page < 4) {
          if (this.totalRecords == 0) {
            this.currentPageSets = [];
            this.isPreviousExists = false;
            this.isNextExists = false;
          }
          else {
            // console.log(this.totalPages);

            if (this.totalPages > 3) {
              for (let i = 0; i < 3; i++) {
                this.currentPageSets[i] = i + 1;
              }
            }
            else {
              this.currentPageSets = [];
              for (let i = 0; i < this.totalPages; i++) {
                this.currentPageSets[i] = i + 1;
              }
            }

            if (this.page == 1) this.isPreviousExists = false;
            else this.isPreviousExists = true;

            if (this.page + 1 > this.totalPages)
              this.isNextExists = false
            else this.isNextExists = true;

          }
          this.showLoader = false;
        }
        else {
          // this.showLoader = true;    
          this.fetchAllTaskHelper();
        }

        // this.showLoader = false;
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.statusText;
        this.errCode = err.status;
        this.showLoader = false;
        this.showError = true;
      }
    })
  }


  public fetchAllTaskHelper() {

    if (this.page + 1 > this.totalPages) this.isNextExists = false
    else this.isNextExists = true;
    this.isPreviousExists = true;
    let r = Math.ceil(this.page / 3);
    let startNumber = (r - 1) * 3 + 1;
    let endNumber = r * 3;
    let till: number = 0;;

    for (let i = startNumber; i <= endNumber; i++) {
      if (i <= this.totalPages) {
        till = i;
      }
    }

    this.currentPageSets = [];
    let j: number = 0;
    for (let i = startNumber; i <= till; i++) {
      this.currentPageSets[j] = i;
      j++;
    }

    this.showLoader = false;
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
        this.showError = true;
        this.showLoader = false;
      }
    })
  }

  public submit() {
    this.createTaskFormGroup.markAllAsTouched();

    if (this.createTaskFormGroup.valid) {
      let id = this.createTaskFormGroup.controls.employeeId.value;
      let newTask: createNewtask = {
        title: this.createTaskFormGroup.controls.title.value,
        description: this.createTaskFormGroup.controls.description.value,
        isCompleted: false,
        employeeId: id
      }

      this.auth.creteNewTask(newTask).subscribe({
        next: (res) => {
          this.createTaskFormGroup.reset();
          this.toastrService.success("Task Created Successfully");
          this.isCreatetask = false;
          this.router.navigate(['/portal/myTasks'], {
            queryParams: {
              page: 1, search: this.filterTask.search,
              take: this.filterTask.take, taskStatus: ''
            }
          })
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }


  public clear() {
    this.createTaskFormGroup.reset();
  }

  public initializecreateTaskFormGroup() {
    return new FormGroup<createTaskModel>({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      isCompleted: new FormControl(false),
      employeeId: new FormControl(null, Validators.required)
    })
  }

  public onKeyDownEvent(event: Event) {
    if (event.type == "keydown") {
      this.router.navigate(['/portal/myTasks'],
        { queryParams: { page: 1, search: this.filterTask.search, take: this.filterTask.take, taskStatus: this.filterTask.isCompleted } })
    }
  }

  public getTaskBystatus() {
    this.router.navigate(['/portal/myTasks'],
      { queryParams: { page: 1, search: this.filterTask.search, take: 5, taskStatus: this.filterTask.isCompleted } })
  }

  public searchWordF() {
    this.currentPage = 0;
    this.isPreviousExists = false;
    this.filterTask.isPagination = true;
    this.filterTask.take = 5;
    this.filterTask.index = 0;

    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: responseTask<taskListModel>) => {

        this.allTaskList = res.iterableData;
        this.totalRecords = res.count;
        // console.log(this.allTaskList);

        if (this.filterTask.take > this.totalRecords) {
          this.isNextExists = false;
        }
        else {
          this.isNextExists = true;
        }

        this.currentPageSets = [];

        this.totalPages = Math.ceil(this.totalRecords / this.filterTask.take);
        if (this.totalPages > 3) {
          this.isNextSetBtnExists = true;
          for (let i = 0; i < 3; i++) {
            this.currentPageSets[i] = i + 1;
          }
        }
        else {
          this.isNextSetBtnExists = false;
          for (let i = 0; i < this.totalPages; i++) {
            this.currentPageSets[i] = i + 1;
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  public getTaskPerPage() {
    // console.log("insdie getTaskPerPage");
    this.router.navigate(['/superAdmin/allTasks'], { queryParams: { page: 1, search: this.searchString, take: this.filterTask.take } })

    /*  this.currentPage = 0;
    this.filterTask.index = 0;
    console.log(this.filterTask.take, this.filterTask.index, this.filterTask.search, this.totalRecords);

    if (this.filterTask.take > this.totalRecords) {
      this.isNextExists = false;
    }
    else {
      this.isNextExists = true;
      this.isPreviousExists = false;
    }
    // if (this.filterTask.take < this.totalRecords) {
    //   this.isNextExists = true;
    // }

    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: response<taskListModel>) => {
        this.allTaskList = res.iterableData;
        // this.totalRecords = this.allTaskList.length;

        this.currentPageSets = [];
        let totalPageTemp = Math.ceil(this.totalRecords / this.filterTask.take);
        this.totalPages = totalPageTemp
        if (this.totalPages > 3) {
          this.isNextSetBtnExists = true;
          for (let i = 0; i < 3; i++) {
            this.currentPageSets[i] = i + 1;
          }
        }
        else {
          this.isNextSetBtnExists = false;
          for (let i = 0; i < this.totalPages; i++) {
            this.currentPageSets[i] = i + 1;
          }
        }
        // for(let i=0; i<tp; i++){
        //   this.currentPageSets[i] = i+1;
        // }
      },
      error: (err) => {
        console.log(err);
      }
    })
    */
  }
  // public getTaskPerPageEvent(pTake: number) {
  //   this.router.navigate(['/superAdmin/allTasks'], 
  //   {queryParams: {page: 1, search: this.searchString, take: pTake, taskStatus: ''}})
  // }


  public getPrevious() {
    this.isNextExists = true;
    this.router.navigate(['/superAdmin/allTasks'],
      { queryParams: { page: this.page - 1, search: this.filterTask.search, take: this.filterTask.take } })
    /*
        if (this.currentPage == this.currentPageSets[0] - 1) {
          this.previousSet();
          return;
        }
    
        this.currentPage = this.currentPage - 1;
        this.isNextExists = true;
    
        if (this.currentPage - 1 < 0) {
          this.isPreviousExists = false;
        }
        if (this.currentPage < 0) {
          this.currentPage = this.currentPage + 1;
          return;
        }
    
        this.filterTask.index = this.currentPage;
        this.auth.getAllTask(this.filterTask).subscribe({
          next: (res: response<taskListModel>) => {
            this.allTaskList = res.iterableData;
          },
          error: (err) => {
            console.log(err);
          }
        })
        */
  }

  // public getPreviousEvent(cPage: number) {
  //   this.isNextExists = true;
  //   this.router.navigate(['/superAdmin/allTasks'], 
  //   {queryParams: {page: this.page-1, search: this.filterTask.search, take: this.filterTask.take, taskStatus: ''}})
  // }


  public getNext() {
    if (this.currentPageSets.length == 3 && this.isNextExists == true) {
      if (this.currentPage == this.currentPageSets[2] - 1) {
        this.nextSet();
        return;
      }
    }
    console.log(this.currentPage);

    this.isPreviousExists = true;
    this.currentPage = this.currentPage + 1;
    if (this.currentPage + 2 > this.totalPages) {
      this.isNextExists = false;
    }
    else {
      this.isNextExists = true;
    }

    this.filterTask.index = this.currentPage;
    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: response<taskListModel>) => {
        this.allTaskList = res.iterableData;
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  public sort(event: { title: string, sortBy: number }) {
    // public sort({sortBy: string, order: number}) {

    if (event.title == "Title") {
      if (event.sortBy == 0) {
        this.isTitleAsscending = true;
        this.isTitleDescending = false;
      }
      else {
        this.isTitleAsscending = false;
        this.isTitleDescending = true;
      }

      this.isDescriptionAsscending = this.isDescriptionDescending = false;
    }
    else {
      if (event.sortBy == 0) {
        this.isDescriptionAsscending = true;
        this.isDescriptionDescending = false;
      }
      else {
        this.isDescriptionAsscending = false;
        this.isDescriptionDescending = true;
      }

      this.isTitleAsscending = this.isTitleDescending = false;
    }


    this.filterTask.orderBy = event.title;
    this.filterTask.orders = event.sortBy;

    this.filterTask.index = this.currentPage;
    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: response<taskListModel>) => {
        this.allTaskList = res.iterableData;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  // public sort(sortBy: string, order: number) {

  //   if (sortBy == "Title") {
  //     if (order == 0) {
  //       this.isTitleAsscending = true;
  //       this.isTitleDescending = false;
  //     }
  //     else {
  //       this.isTitleAsscending = false;
  //       this.isTitleDescending = true;
  //     }

  //     this.isDescriptionAsscending = this.isDescriptionDescending = false;
  //   }
  //   else {
  //     if (order == 0) {
  //       this.isDescriptionAsscending = true;
  //       this.isDescriptionDescending = false;
  //     }
  //     else {
  //       this.isDescriptionAsscending = false;
  //       this.isDescriptionDescending = true;
  //     }

  //     this.isTitleAsscending = this.isTitleDescending = false;
  //   }


  //   this.filterTask.orderBy = sortBy;
  //   this.filterTask.orders = order;

  //   this.filterTask.index = this.currentPage;
  //   this.auth.getAllTask(this.filterTask).subscribe({
  //     next: (res: response<taskListModel>) => {
  //       this.allTaskList = res.iterableData;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }

  public pageClicked(pageN: number) {
    pageN = pageN - 1;
    console.log(pageN);
    this.filterTask.index = pageN;
    this.currentPage = pageN;

    this.isPreviousExists = true;
    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: response<taskListModel>) => {
        this.allTaskList = res.iterableData;
        // this.totalPages = 
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // public nextSet(){
  //   let remainingPages = this.totalPages - this.currentPageSets[this.currentPageSets.length-1];
  //   let lastPage = this.currentPageSets[this.currentPageSets.length-1];
  //   this.filterTask.index = lastPage;
  //   this.currentPage = this.filterTask.index;

  //   this.auth.getAllTask(this.filterTask).subscribe({
  //     next: (res: response<taskListModel>) =>{
  //       this.allTaskList = res.iterableData;
  //     },
  //     error: (err) =>{
  //       console.log(err);
  //     }
  //   })
  //   this.isPreviousSetBtnExists = true;
  //   if(remainingPages > 3){
  //     this.isNextSetBtnExists = true;
  //     this.isNextExists = true;

  //     this.currentPageSets = [];
  //     for(let i=0; i<3; i++){
  //       this.currentPageSets[i] = i+1+lastPage;
  //     }
  //   }
  //   else{
  //     this.isNextSetBtnExists = false;
  //     this.isNextExists = false;
  //     this.currentPageSets = [];
  //     for(let i=0; i<remainingPages; i++){
  //       this.currentPageSets[i] = i+1+lastPage;
  //     }
  //   }
  // }
  public nextSet() {
    let remainingPages = this.totalPages - this.currentPageSets[this.currentPageSets.length - 1];
    let lastPage = this.currentPageSets[this.currentPageSets.length - 1];
    this.filterTask.index = lastPage;
    this.currentPage = this.filterTask.index;

    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: response<taskListModel>) => {
        this.allTaskList = res.iterableData;
      },
      error: (err) => {
        console.log(err);
      }
    })

    if (this.currentPage + 2 > this.totalPages) {
      this.isNextExists = false;
    }
    else {
      this.isNextExists = true;
    }
    this.isPreviousSetBtnExists = true;
    if (remainingPages > 3) {
      this.isNextSetBtnExists = true;
      this.isNextExists = true;

      this.currentPageSets = [];
      for (let i = 0; i < 3; i++) {
        this.currentPageSets[i] = i + 1 + lastPage;
      }
    }
    else {
      this.isNextSetBtnExists = false;
      this.isNextExists = false;
      this.currentPageSets = [];
      for (let i = 0; i < remainingPages; i++) {
        this.currentPageSets[i] = i + 1 + lastPage;
      }
    }

    if (this.currentPage + 2 > this.totalPages) {
      this.isNextExists = false;
    }
    else {
      this.isNextExists = true;
    }
  }

  public previousSet() {
    let firstPage = this.currentPageSets[0];
    this.currentPage = firstPage - 3 - 1;
    if (firstPage > 1) {
      let startingPage = firstPage - 3;
      this.filterTask.index = this.currentPage;
      // this.currentPage = this.filterTask.index;

      this.isNextSetBtnExists = true;
      this.isNextExists = true;

      for (let i = 0; i < 3; i++) {
        this.currentPageSets[i] = startingPage + i;
      }
      if (firstPage == 4) {
        this.isPreviousExists = false;
        this.isPreviousSetBtnExists = false;
      }
      this.auth.getAllTask(this.filterTask).subscribe({
        next: (res: response<taskListModel>) => {
          this.allTaskList = res.iterableData;
        },
        error: (err) => {
          console.log(err);
        }
      })

    }
    else {
      this.isPreviousExists = false;
    }
  }

  public createTaskShow() {
    this.isCreatetask = !this.isCreatetask;

    if (this.hideCreateString == "Create task") {
      this.hideCreateString = "Hide";
    }
    else {
      this.hideCreateString = "Create task";
    }
  }

  public getNextEvent(cPage: number) {
    // console.log(this.filterTask.isCompleted);
    this.router.navigate(['/portal/myTasks'],
      { queryParams: { page: cPage + 1, search: this.searchString, take: this.filterTask.take, taskStatus: this.filterTask.isCompleted } })
  }

  public getClickedpageEvent(cPage: number) {
    this.router.navigate(['/portal/myTasks'],
      { queryParams: { page: cPage, search: this.searchString, take: this.filterTask.take, taskStatus: this.filterTask.isCompleted } })
  }
  public getTaskPerPageEvent(pTake: number) {
    this.router.navigate(['/portal/myTasks'],
      { queryParams: { page: 1, search: this.searchString, take: pTake, taskStatus: this.filterTask.isCompleted } })
  }
  public getPreviousEvent(cPage: number) {
    this.isNextExists = true;
    this.router.navigate(['/portal/myTasks'],
      {
        queryParams: {
          page: this.page - 1, search: this.filterTask.search, take: this.filterTask.take,
          taskStatus: this.filterTask.isCompleted
        }
      })
  }
}

// current is zero based
