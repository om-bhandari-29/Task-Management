import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { SignupFormData, SignupFormModel } from 'src/app/Models/signup.model';
import { AuthService } from 'src/app/Services/auth.service';
import { response } from 'src/app/Generics/GenericResponse';
import { departmentIterable } from 'src/app/Models/department.model';
import { Response } from 'src/app/Generics/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private toastrService: ToastrService){}
  public allDepartListService: departmentIterable[] = [];
  public isSubmitted: boolean = false;
  public isShowSbnt: boolean = false;
  
  ngOnInit(): void {
    this.isSubmitted = false;
    this.auth.getAllDepartment().subscribe({
      next: (v: response<departmentIterable>) => {        
        this.allDepartListService = v.iterableData;
        console.log(this.allDepartListService);
      },
      error: (err) => console.log("error: ", err)  
    })
  }


  public signupFormGroup: FormGroup<SignupFormModel> = this.initializeSignupFormGroup();

  public singupUser(){
    this.isSubmitted = true;
    // console.log(this.signupFormGroup);
    
    this.signupFormGroup.markAllAsTouched();

    if(this.signupFormGroup.valid){
      this.isShowSbnt = true;
      const signupUser: SignupFormData = {
        name: this.signupFormGroup.controls.name.value,
        email: this.signupFormGroup.controls.email.value,
        password: this.signupFormGroup.controls.password.value,
        employeeType: 0,
        address: this.signupFormGroup.controls.address.value,
        city: this.signupFormGroup.controls.city.value,
        country: this.signupFormGroup.controls.country.value,
        phone: this.signupFormGroup.controls.phone.value?.toString(),
        departmentID: this.signupFormGroup.controls.departmentID.value,
      }
      
      this.auth.signup(signupUser).subscribe({
        next: (v: Response) => {        
          if(v.statusCode == 201){
            this.toastrService.success("SignedUp success");
            this.isShowSbnt = false;
            this.router.navigate(['/login'])
          }
        },
        error: (err) => {    
          this.isShowSbnt = false;      
          this.toastrService.error(err.message);
        }  
      })
    }
  }



  
  public showError(control: AbstractControl, error: string): boolean{
    // console.log(control, error);
    
    return this.isSubmitted && (control.errors?.[error] == error)? true: false;
  }


  public initializeSignupFormGroup(){
    return new FormGroup<SignupFormModel>({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9_\-\.]+@[a-z]+\.[c][o][m]/)]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}/)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      employeeType: new FormControl(0, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/\d{10}/)]),
      departmentID: new FormControl(null, [Validators.required])
    }, {validators: this.customPasswordMatching.bind(this)});
  }
  
  /*
    employeeType = 0 is employee
    employeeType = 1 is admin
    employeeType = 2 is super admin
   */
  
  public customPasswordMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatchError: true };
  }
}
