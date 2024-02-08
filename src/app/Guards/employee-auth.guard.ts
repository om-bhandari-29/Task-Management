import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { RoleType } from '../Enums/RoleType.enum';

export const employeeAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let empType;

  if(!localStorage.getItem(environment.tokenName)){
    return router.navigate(['/login']);
  }


  if(localStorage.getItem(environment.employeeType)){
    empType = localStorage.getItem(environment.employeeType);
  }

  //LOGGED IN AS SUPERADMIN
  if(empType == RoleType[2]){
    return router.navigate(['/superAdmin']);
  }
  // if(localStorage.getItem(environment.employeeType) == "2"){
  //   return router.navigate(['/superAdmin']);
  // }

  //LOGGED IN AS ADMIN
  if(empType == RoleType[2]){
    return router.navigate(['/admin']);
  }
  // if(localStorage.getItem(environment.employeeType) == "1"){
  //   return router.navigate(['/admin']);
  // }

  return true;
};
