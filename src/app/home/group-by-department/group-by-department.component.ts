import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/Services/auth.service';
import { response } from 'src/app/Generics/GenericResponse';
import { groupByDepartmentResponse } from 'src/app/Models/department.model';

@Component({
  selector: 'app-group-by-department',
  templateUrl: './group-by-department.component.html',
  styleUrls: ['./group-by-department.component.scss']
})
export class GroupByDepartmentComponent implements OnInit {

  constructor(private auth: AuthService) { }
  public groupByDepartMentList: groupByDepartmentResponse[] = [];

  ngOnInit(): void {
    this.auth.groupByDepartment().subscribe({
      next: (res: response<groupByDepartmentResponse>) => {
        this.groupByDepartMentList = res.iterableData;
      },

      error: (err) => {
        console.log(err);
      }
    })
  }
}
