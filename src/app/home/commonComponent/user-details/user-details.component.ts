import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from 'src/app/Services/auth.service';
import { getUserData, response3 } from 'src/app/Generics/GenericResponse';
import { user } from 'src/app/Models/user.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupFormModel } from 'src/app/Models/signup.model';
import { ToastrService } from 'ngx-toastr';
import { userDetailsModel } from 'src/app/Models/userDetail.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService,
    private router: Router,
    private toastrService: ToastrService) { }

  public loggedInUserData: user | null = null;
  public isShowOptionComponent: boolean = false;
  public isEdit: boolean = false;
  public showLoader: boolean = true;
  public showError: boolean = false;
  public isSubmitted: boolean = false;

  public userDetailsFormGroup: FormGroup<userDetailsModel> = this.initializeUserDetailsFormGroup();

  public isChangesSaved = new BehaviorSubject<boolean>(true);

  ngOnInit(): void {

    this.isChangesSaved.next(true);

    // console.log(this.userDetailsFormGroup);
    

    if (this.router.url != 'dashboard') {
      this.isShowOptionComponent = true;
    }

    this.auth.getUserDetail().subscribe({
      next: (res: getUserData<user>) => {
        this.loggedInUserData = res.data;       
        this.showLoader = false;

        const userDetails = {
          name: this.loggedInUserData.name,
          email: this.loggedInUserData.email,
          employeeType: this.loggedInUserData.employeeType,
          address: this.loggedInUserData.address,
          city: this.loggedInUserData.city,
          country: this.loggedInUserData.country,
          phone: this.loggedInUserData.phone,
          departmentID: this.loggedInUserData.departmentID,
          departmentName: this.loggedInUserData.departmentName
        }
        this.userDetailsFormGroup.patchValue(userDetails);

      },
      error: (err) => {
        console.log("err : ", err);
        this.showError = true;
      }
    });
  }

  public editDetails(val: boolean) {
    this.isEdit = val;
    this.isChangesSaved.next(false);
  }
  public cancelEditDetails(val: boolean) {
    this.isEdit = val;
    this.isChangesSaved.next(true);
    // this.router.navigate(['/profile']);
    // this.ngOnInit();
  }

  public submit() {
    
    this.isChangesSaved.next(true);
    let id = this.loggedInUserData?.id;
    this.isEdit = false;

    const userDetails = {
      name: this.userDetailsFormGroup.controls.name.value,
      email: this.userDetailsFormGroup.controls.email.value,
      employeeType: this.userDetailsFormGroup.controls.employeeType.value,
      address: this.userDetailsFormGroup.controls.address.value,
      city: this.userDetailsFormGroup.controls.city.value,
      country: this.userDetailsFormGroup.controls.country.value,
      phone: this.userDetailsFormGroup.controls.phone.value,
      departmentID: this.userDetailsFormGroup.controls.departmentID.value,
    }
    
    // console.log(userDetails);
    // let id  = this.userDetailsFormGroup.controls.employeeType.value;

    if(this.userDetailsFormGroup.valid){
      
      if(id){
        // console.log(id);
        this.showLoader = true;
        
        this.auth.editDetails(id, userDetails).subscribe({
          next: (res: response3) => {
            if (res.statusCode == 200) {
              this.toastrService.success("Profile Updated Successfully");
              this.showLoader = false;
              this.ngOnInit();
            }
    
          },
          error: (err) => {
            console.log("err : ", err);
            this.showLoader = false;
            this.showError = true;
          }
        })
      }
    }

  }

  public initializeUserDetailsFormGroup() {
    return new FormGroup<userDetailsModel>({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9_\-\.]+@[a-z]+\.[c][o][m]/)]),
      employeeType: new FormControl(null, [Validators.required]),
      departmentID: new FormControl(null, [Validators.required]),

      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/\d{10}/)]),
      departmentName: new FormControl(null)
    });
  }

  public showFormError(control: AbstractControl, error: string): boolean{    
    return this.isSubmitted && (control.errors?.[error] == error)? true: false;
  }
  
  public showChangesAlert(){
    // if(this.isEdit){
      alert("Please save the changes");

    //   return false;
    // }
    // return true;
  }

  ngOnDestroy(): void {
    // console.log(this.userDetailsFormGroup.dirty);
    // if(this.isEdit && this.userDetailsFormGroup.dirty){
      
    // }
    // else if(this.isEdit){
    //   alert("Cancel it, if you don't want to make changes");
    // }
  }
}
