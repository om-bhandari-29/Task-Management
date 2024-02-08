import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { RoleType } from '../Enums/RoleType.enum';

export const adminASuperAdminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  let empType;
  
  if(localStorage.getItem(environment.employeeType)){
    empType = localStorage.getItem(environment.employeeType)
  }

  if(empType == RoleType[1] || empType == RoleType[2]){
    return true;
  }

  return false;
};
