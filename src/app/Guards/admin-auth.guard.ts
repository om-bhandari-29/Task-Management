import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { RoleType } from '../Enums/RoleType.enum';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let empType;
  
  // console.log(route.root);
  // console.log(state);
    
  // NO ONE IS LOGGED IN  
  // if(!localStorage.getItem(environment.tokenName)){
  //   return router.navigate(['/login']);
  // }
  
  if(localStorage.getItem(environment.employeeType)){
    empType = localStorage.getItem(environment.employeeType)
  }
  
  // LOGGED IN AS EMPLOYEE
  // if(empType == RoleType[0]){
  //   return router.navigate(['/employee'])
  // }
  
  // LOGGED IN AS SUPER ADMIN
  // if(empType == RoleType[2]){
  //   return router.navigate(['/superAdmin'])
  // }

  // LOGGED IN AS ADMIN
  if(empType == RoleType[1]){
    return true;
  }


  return router.navigate(['/dashboard']);
};

