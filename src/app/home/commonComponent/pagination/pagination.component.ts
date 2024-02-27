import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAllEmployeeI, getAllTaskI } from 'src/app/Models/user.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() filterObj!: getAllTaskI | getAllEmployeeI;
  @Input() currntPageChild!: number;    //current page
  @Input() totalRecordsChild!: number;
  @Input() recordsPerPageC!: number;
  
  
  
  @Output() getTaskPerPageChild = new EventEmitter<number>();
  @Output() getPreviousEventChild = new EventEmitter<number>();
  @Output() getNextEventChild = new EventEmitter<number>();
  @Output() getClickedpageEventChild = new EventEmitter<number>();
  
  
  public currentPageSet: number[] = [];
  public totalPages: number = 0;
  public isNextExists: boolean = false;
  public isPreviousExists: boolean = false;
  
  ngOnInit(): void {
    this.fillPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
        
    if(changes['pageChild']?.currentValue != undefined){
      this.currntPageChild = changes['pageChild'].currentValue;
    }
    if(changes['totalRecordsChild']?.currentValue != undefined){
      this.totalRecordsChild = changes['totalRecordsChild'].currentValue;
    }
    
    this.fillPage();
    // this.isPreviousExists = false;
    // this.totalPages = Math.ceil(this.totalRecordsChild / this.filterObj.take);
    // console.log(this.totalPages);
    

    // if (this.currntPageChild > 0 && this.currntPageChild < 4) {
    //   if (this.totalRecordsChild == 0) {
    //     this.currentPageSet = [];
    //     this.isPreviousExists = false;
    //     this.isNextExists = false;
    //   }
    //   else {
        
    //     this.currentPageSet = [];
    //     if (this.totalPages > 3) {
    //       for (let i = 0; i < 3; i++) {
    //         this.currentPageSet[i] = i + 1;
    //       }
    //     }
    //     else {
    //       this.currentPageSet = [];
    //       for (let i = 0; i < this.totalPages; i++) {
    //         this.currentPageSet[i] = i + 1;
    //       }
    //     }

    //     if (this.currntPageChild == 1) this.isPreviousExists = false;
    //     else this.isPreviousExists = true;

    //     if (this.currntPageChild + 1 > this.totalPages)
    //       this.isNextExists = false
    //     else this.isNextExists = true;

    //   }
    // }
    // else {   
    //   this.fetchAllTaskHelper();
    // }
  }

  public fetchAllTaskHelper() {

    if (this.currntPageChild + 1 > this.totalPages) this.isNextExists = false
    else this.isNextExists = true;
    this.isPreviousExists = true;
    let r = Math.ceil(this.currntPageChild / 3);
    let startNumber = (r - 1) * 3 + 1;
    let endNumber = r * 3;
    let till: number = 0;;

    for (let i = startNumber; i <= endNumber; i++) {
      if (i <= this.totalPages) {
        till = i;
      }
    }

    this.currentPageSet = [];
    let j: number = 0;
    for (let i = startNumber; i <= till; i++) {
      this.currentPageSet[j] = i;
      j++;
    }
  }
  
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

  public fillPage(){
    this.isPreviousExists = false;
    this.totalPages = Math.ceil(this.totalRecordsChild / this.filterObj.take);
    // console.log(this.totalPages);
    

    if (this.currntPageChild > 0 && this.currntPageChild < 4) {
      if (this.totalRecordsChild == 0) {
        this.currentPageSet = [];
        this.isPreviousExists = false;
        this.isNextExists = false;
      }
      else {
        
        this.currentPageSet = [];
        if (this.totalPages > 3) {
          for (let i = 0; i < 3; i++) {
            this.currentPageSet[i] = i + 1;
          }
        }
        else {
          this.currentPageSet = [];
          for (let i = 0; i < this.totalPages; i++) {
            this.currentPageSet[i] = i + 1;
          }
        }

        if (this.currntPageChild == 1) this.isPreviousExists = false;
        else this.isPreviousExists = true;

        if (this.currntPageChild + 1 > this.totalPages)
          this.isNextExists = false
        else this.isNextExists = true;

      }
    }
    else {   
      this.fetchAllTaskHelper();
    }
  }
}
