import { Component, OnInit } from '@angular/core';
import { notification, response, response3 } from 'src/app/Generics/GenericResponse';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private auth: AuthService){}
  public allNotifications: notification[] = [];
  public showLoader: boolean = true;

  public notification = {
    isPagination: false,
    index: 0,
    take: 5,
    search: null,
    isSeen: null
  }
  ngOnInit(): void {
    this.showLoader = true;
    this.auth.getNotifications(this.notification).subscribe({
      next: (res: response<notification>) => {
        this.allNotifications = res.iterableData;
        this.showLoader = false;
      },
      error: (err) => {
        alert(`${err.statusText}`);
        this.showLoader = false;
      }
    })
  }

  public getCustomNotifications(){
    this.ngOnInit();
  }

  public markAsRead(id: number){
    let arr = {
      "notificationIDs": [id]
    };
    
    this.showLoader = true;
    this.auth.markNotificationAsRead(arr).subscribe({
      next: (res: response3) => {
        if(res.statusCode == 200){
          this.showLoader = false;
          this.ngOnInit();
        }
      },
      error: (err) => {
        alert(`${err.statusText}`);
        this.showLoader = false;
      }
    })
  }
  
}
