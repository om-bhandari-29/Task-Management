import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';
import { AuthService } from './auth.service';
import { getUserData } from '../Generics/GenericResponse';
import { user } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private auth: AuthService) { }

  public isLoggedInF(){
    let token = localStorage.getItem(environment.tokenName);

    if(token){
      return true;
    }

    return false;
  }

  public loggedInUserName(){
    let token = localStorage.getItem(environment.name);
    if(token){
      if(JSON.parse(token)){
        return JSON.parse(token);
      }
    }
    return "";
  }

  public isLoggedInE = new EventEmitter<boolean>();
  public loggedInUserNameE: EventEmitter<string> = new EventEmitter<string>(); 

  // public loggedInUserDepartmentId: number = -1;
  
}
