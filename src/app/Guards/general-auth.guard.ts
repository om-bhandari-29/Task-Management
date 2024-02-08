import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const generalAuthGuard: CanActivateFn = (route, state) => {

  // console.log(route.url[0].path);
  
  // token exists, means user is logged in
  if(localStorage.getItem("loggedInUser_EmployeeType")){
    return true;
  }
  return inject(Router).navigate(['/login']);
};
