import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { response } from 'src/app/Generics/GenericResponse';
import { getAllEmployeeI, user } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-department-user',
  templateUrl: './department-user.component.html',
  styleUrls: ['./department-user.component.scss']
})
export class DepartmentUserComponent implements OnInit {
  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  public allEmployeeList: user[] = [];
  public showLoader: boolean = true;
  public isDepartEmployeeRoute: boolean = false;
  public departID: number = -1;

  public userListM: getAllEmployeeI = {
    isPagination: false,
    index: 0,
    take: 0,
    search: null,
    orders: null,
    orderBy: null
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (param: Params) => {
        if (param['id']) {

          this.departID = parseInt(param['id']);
          this.isDepartEmployeeRoute = true;
          this.showLoader = true;

          this.auth.getAllEmployee(this.userListM).subscribe({
            next: (res: response<user>) => {
              this.showLoader = false;

              this.allEmployeeList = [];

              res.iterableData.map(
                (emp: user) => {
                  if (emp.departmentID == this.departID) {
                    this.allEmployeeList.push(emp);
                  }
                }
              )
            },

            error: (err) => {
              console.log(err);
            }
          })
        }
      }
    )
  }

  public assignTask(emp: user) {
    this.router.navigate(['/portal/assignTask'], { queryParams: { id: emp.id } });
  }


}
