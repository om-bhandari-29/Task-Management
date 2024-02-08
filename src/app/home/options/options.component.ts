import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/Environments/environment';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  standalone: true,
  imports: [ RouterModule, CommonModule],
})
export class OptionsComponent implements OnInit {
  constructor(private router: Router) { }

  @Input() show!: boolean;

  public employeeType: string = "";
  public ismyTaskActive: boolean = false;

  // public employeeType: string | null = "";
  public isEmployee: boolean = false;

  ngOnInit(): void {

    if (this.employeeType == "Employee") {
      this.isEmployee = true;
    }
    // if(localStorage.getItem("loggedInUser_EmployeeType")){
    // this.employeeType = localStorage.getItem("loggedInUser_EmployeeType")
    // }

    if (this.router.url.startsWith('/myTasks')) {
      this.ismyTaskActive = true;
      // console.log(true);

    }
    let emptype = localStorage.getItem(environment.employeeType);

    if (emptype) {
      this.employeeType = emptype;
    }
  }


}
