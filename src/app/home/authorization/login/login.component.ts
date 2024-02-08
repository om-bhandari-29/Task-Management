import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginFormData, LoginFormModel } from 'src/app/Models/login.model';
import { environment } from 'src/Environments/environment';

import { AuthService } from 'src/app/Services/auth.service';
import { responseG } from 'src/app/Generics/GenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/Services/utils.service';
import { user } from 'src/app/Models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private auth: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilS: UtilsService,
    private toastrService: ToastrService){      
    }

  public loginFormGroup: FormGroup<LoginFormModel> = this.initializeLoginFormGroup();
  public showPatternError: boolean = false;
  public showMinlengthError: boolean = false;
  public isSubmitted: boolean = false;
  public showLoader: boolean = false;

  public showError(control: AbstractControl, errorType: string): boolean{

    return (this.isSubmitted) && control.errors?.[errorType];
  }

  public loginUser(){
    this.isSubmitted = true;
    this.loginFormGroup.markAllAsTouched();
    
    if(this.loginFormGroup.controls.email.errors?.['pattern']){
      this.showPatternError = true;
    }

    if(this.loginFormGroup.controls.password.errors?.['minlength']){
      this.showMinlengthError = true;
    }

    if(this.loginFormGroup.valid){
      const loginUserData: LoginFormData = this.loginFormGroup.value;
      
      this.showLoader = true;
      this.auth.signIn(loginUserData).subscribe({
        next: (res: responseG<user>) => {                 
          if(res.statusCode == 200){
            this.toastrService.success("Logged in success");

            localStorage.setItem(environment.tokenName, res.token);
            this.loginFormGroup.reset();

            if(res.data.employeeType == 0){
              localStorage.setItem(environment.employeeType, "Employee");
            }
            if(res.data.employeeType == 1){
              localStorage.setItem(environment.employeeType, "Admin");
            }
            if(res.data.employeeType == 2){
              localStorage.setItem(environment.employeeType, "SuperAdmin");
            }

            localStorage.setItem(environment.employeeId, JSON.stringify(res.data.id));
            localStorage.setItem(environment.name, JSON.stringify(res.data.name));
            localStorage.setItem("departId", JSON.stringify(res.data.departmentID));

            this.utilS.isLoggedInE.emit(true);
            this.utilS.loggedInUserNameE.emit(res.data.name);
            
            // this.router.navigate(['/dashboard']);
            this.router.navigate(['/portal']);
            this.showLoader = false;
          }
        },
        error: (err) =>{
          this.toastrService.error(err.message);
          // this.showError = true;
          this.showLoader = false;
        }
      })
    }else{
      setTimeout(() => {
       this.showPatternError = false;
       this.showMinlengthError = false;
      }, 1900);
    }
  }



  public initializeLoginFormGroup() {
    return new FormGroup<LoginFormModel>({
        email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9_\-\.]+@[a-z]+\.[c][o][m]/)]),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }
}
