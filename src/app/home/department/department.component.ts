import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/Services/auth.service';
import { response } from 'src/app/Generics/GenericResponse';
import { departmentIterable } from 'src/app/Models/department.model';
import { deleteDepartResponse } from 'src/app/Models/department.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  
  constructor(private auth: AuthService, private toatrService: ToastrService, private router: Router){}
  
  public departmentList: departmentIterable[] = [];
  public showLoader: boolean = true;
  public showError = false;
  
  ngOnInit(): void {
    this.showLoader = true;
    this.auth.getAllDepartment()
    .subscribe({
      next: (res: response<departmentIterable>) =>{
        this.departmentList = res.iterableData;           
        this.showLoader = false;
      },

      error: (err) => {
        console.log(err);
        this.showError = true;
        this.showLoader = false;
      }
    })
  }

  public addDepartment(departName: HTMLInputElement){
    if(departName.value.trim() == ""){
      alert("PLease Enter Valid Name")
    }
    else{
      const newDapart = {
        departmentName: departName.value.trim()
      }
      departName.value = "";
      this.auth.addDepartment(newDapart).subscribe({
        next: ((res: {message: string, statusCode: number}) => {
          if(res.statusCode == 201){
            this.toatrService.success("Department Added Successfully");
            this.ngOnInit();
          }
        }),
        error: (err => {
          console.log(err);
        })
      })
    }
  }
  
  public onKeyDownEvent(event: Event, departName: HTMLInputElement) {
    if (event.type == "keydown"){
      this.addDepartment(departName);
    }
  }

  public deleteDepartMent(departID: number){
    if(confirm("Do you want to delete department ?")){
      this.auth.deleteDepartmentById(departID).subscribe({
        next: ((res: deleteDepartResponse) => {
          if(res.statusCode == 202){
            this.toatrService.success("Department Deleted Successfully");
            this.ngOnInit();
          }
        }),
        error: (err => {
          console.log(err);
        })
      })
    }
  }

  public showMore(id: number){
    this.router.navigate([`/portal/departments/${id}`]);
  }

}
