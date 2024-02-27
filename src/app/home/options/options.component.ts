import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { UtilsService } from 'src/app/Services/utils.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  standalone: true,
  imports: [ RouterModule, CommonModule],
})
export class OptionsComponent implements OnInit {
  constructor(private router: Router, private utilS: UtilsService) { }

  @Input() show!: boolean;

  public employeeType: string = "";
  public ismyTaskActive: boolean = false;

  public userName: string = "";
  public isEmployee: boolean = false;

  ngOnInit(): void {


    let name = localStorage.getItem("employeename");
    if (name) {
      this.userName = name;
    }

    let emptype = localStorage.getItem(environment.employeeType);

    if (emptype) {
      this.employeeType = emptype;
    }
    
    if (this.employeeType == "Employee") {
      this.isEmployee = true;
    }


    if (this.router.url.startsWith('/myTasks')) {
      this.ismyTaskActive = true;
    }
  }

  public logOut(){
    this.router.navigate([''])
    localStorage.clear();
    this.utilS.isLoggedInE.emit(false);
  }

}
