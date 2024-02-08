import { CanDeactivateFn } from '@angular/router';
import { UserDetailsComponent } from '../home/commonComponent/user-details/user-details.component';

export const profileSaveGuard: CanDeactivateFn<UserDetailsComponent> = (component, currentRoute, currentState, nextState) => {
  
  let isChangesSavedO: boolean = true;
  
  component.isChangesSaved.subscribe(
    (val: boolean) =>{
      isChangesSavedO = val;
    }
  )
  
  if(!isChangesSavedO){
    component.showChangesAlert();
    return false;
  }
  return true;
};

