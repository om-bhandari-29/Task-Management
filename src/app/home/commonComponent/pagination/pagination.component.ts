import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { taskListModel } from 'src/app/Models/task.model';
import { getAllEmployeeI, getAllTaskI } from 'src/app/Models/user.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaginationComponent {
  @Input() filterObj!: getAllTaskI | getAllEmployeeI;
  @Input() allTaskListChild!: taskListModel[];
  @Input() currentPageSetsChild!: number[];
  @Input() isPreviousExistsChild!: boolean;
  @Input() isNextExistsChild!: boolean;
  @Input() pageChild!: number;

  @Output() getTaskPerPageChild = new EventEmitter<number>();
  @Output() getPreviousEventChild = new EventEmitter<number>();
  @Output() getNextEventChild = new EventEmitter<number>();
  @Output() getClickedpageEventChild = new EventEmitter<number>();

  public getTaskPerPage() {
    this.getTaskPerPageChild.emit(this.filterObj.take);
  }

  public getPrevious() {
    this.getPreviousEventChild.emit(this.filterObj.index - 1);
  }

  public getNext() {
    this.getNextEventChild.emit(this.filterObj.index + 1);
  }

  public getClickedpage(cPage: number) {
    this.getClickedpageEventChild.emit(cPage);
  }
}
