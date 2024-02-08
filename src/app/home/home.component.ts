import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../Services/utils.service';
import { environment } from 'src/Environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(private utilS: UtilsService, private router: Router){}

  public isL: boolean = false;
  public loggedInUserName: string = "";
  
  ngOnInit(): void {
    this.isL = this.utilS.isLoggedInF();
    if(this.isL){
      this.loggedInUserName = this.utilS.loggedInUserName();
    }

    this.utilS.isLoggedInE.subscribe(
      (val: boolean) =>{
        this.isL = val;
      }
    )

    this.utilS.loggedInUserNameE.subscribe(
      (name: string) =>{
        this.loggedInUserName = name;
      }
    )
  }

  public logOut(){
    // localStorage.removeItem(environment.tokenName);
    this.router.navigate([''])
    localStorage.clear();
    this.utilS.isLoggedInE.emit(false);
    // this.ngOnInit();
    
  }

}
