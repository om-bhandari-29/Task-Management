import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { RoleType } from '../Enums/RoleType.enum';

export const superAdminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let empTpe;

  //NO ONE IS LOGGED IN
  // if(!localStorage.getItem(environment.tokenName)){
  //   return router.navigate(['/login']);
  // }

  if(localStorage.getItem(environment.employeeType)){
    empTpe = localStorage.getItem(environment.employeeType);
  }
  
  // LOGGED IN AS SUPERADMIN
  if(empTpe == RoleType[2]){
    // return router.navigate(['/employee']);
    return true;
  }
  return router.navigate(['/dashboard']);

  // LOGGED IN AS EMPLOYEE
  // if(empTpe == RoleType[0]){
  //   return router.navigate(['/employee']);
  // }

  //LOGGED IN AS ADMIN
  // if(empTpe == RoleType[1]){
  //   return router.navigate(['/admin']);
  // }

  // return true;
};
