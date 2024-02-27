import { Component, OnInit, Renderer2 } from '@angular/core';
import { response3, responseTask } from 'src/app/Generics/GenericResponse';
import { taskListModel } from 'src/app/Models/task.model';
import { getAllTaskI } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drag-droptask',
  templateUrl: './drag-droptask.component.html',
  styleUrls: ['./drag-droptask.component.scss']
})
export class DragDroptaskComponent implements OnInit {
  public completedTask: taskListModel[] = [];
  public inCompletedTask: taskListModel[] = [];
  public isShowLoader: boolean = true;

  constructor(private auth: AuthService, private toastreService: ToastrService, private _renderer : Renderer2) {
  }

  public filterTask: getAllTaskI = {
    isPagination: false,
    index: 0,
    take: 5,
    search: "",
    orders: 1,
    orderBy: "id",
    isCompleted: null
  }

  ngOnInit(): void {
    this.fetchAllTask()
  }

  public trackByInCompletedTask(id: number, task: taskListModel): number {
    return task.id;
  }
  public trackByCompletedTask(id: number, task: taskListModel): number {
    return task.id;
  }

  public drop(event: CdkDragDrop<taskListModel[]>) {

    if (event.previousContainer !== event.container) {
      let currectIndex = event.currentIndex;

      //picking task from to incompleted
      if (event.container.id == 'todo') {

        const cTask: taskListModel = this.completedTask[event.previousIndex];
        this.completedTask.splice(event.previousIndex, 1);

        let id: number = this.completedTask[event.previousIndex].id;
        // this.inCompletedTask.unshift(cTask);
        this.inCompletedTask.splice(currectIndex, 0, cTask);

        let data: { isCompleted: boolean } = {
          isCompleted: false
        };

        this.auth.completeTaskById(id, data).subscribe({
          next: (res: response3) => {
            if (res.statusCode == 200) {
              this.toastreService.success("Task Incompleted successfully");
            }
            else {
              this.completedTask.push(cTask);
              // this.inCompletedTask.shift();
              this.inCompletedTask.splice(currectIndex, 1);
            }
          },

          error: (err) => {
            this.completedTask.push(cTask);
            // this.inCompletedTask.shift();
            this.inCompletedTask.splice(currectIndex, 1);
            console.log(err);
            this.toastreService.error(err.message);
          }
        })

      }

      // picking task from incompleted to completed
      else {
        let id: number = this.inCompletedTask[event.previousIndex].id;

        const cTask: taskListModel = this.inCompletedTask[event.previousIndex];
        this.inCompletedTask.splice(event.previousIndex, 1);

        // this.completedTask.unshift(cTask);
        this.completedTask.splice(currectIndex, 0, cTask);

        let data: { isCompleted: boolean } = {
          isCompleted: true
        };


        this.auth.completeTaskById(id, data).subscribe({
          next: (res) => {
            if (res.statusCode == 200) {
              this.toastreService.success("Task Completed successfully");
            }
            else {
              this.inCompletedTask.push(cTask);
              // this.completedTask.shift();
              this.completedTask.splice(currectIndex, 1);
            }
          },

          error: (err) => {
            this.inCompletedTask.push(cTask);
            // this.completedTask.shift();
            this.completedTask.splice(currectIndex, 1);
            console.log(err);
            this.toastreService.error(err.message);
          }
        })
      }

    }
  }

  public dragEntered(event: any){
    console.log(event);
    const droppedElement = event.container.element.nativeElement.children[event.currentIndex];
    droppedElement.classList.add('green-background');
    const container = event.target;
    console.log(container);
    if(container){
      container.classList.add('green-background');
    }

  }

  private fetchAllTask() {
    this.isShowLoader = true;

    this.isShowLoader = true;
    this.auth.getAllTask(this.filterTask).subscribe({
      next: (res: responseTask<taskListModel>) => {
        this.completedTask = [];
        this.inCompletedTask = [];
        res.iterableData.map(
          (tsk) => {
            if (tsk.isCompleted) {
              this.completedTask.push(tsk);
            }
            else {
              this.inCompletedTask.push(tsk);
            }
          }
        )

        this.isShowLoader = false;
      },
      error: (err) => {
        this.isShowLoader = false;
        console.log(err);
      }
    })
  }
}
