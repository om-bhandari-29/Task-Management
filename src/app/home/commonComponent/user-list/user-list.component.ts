import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { response, response3, responseTask } from 'src/app/Generics/GenericResponse';
import { getMessageI, getMessageResI } from 'src/app/Models/chats.model';
import { getAllEmployeeI, user } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';
import { ChatPopUpComponent } from 'src/app/commomComponent/chat-pop-up/chat-pop-up.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(ChatPopUpComponent) ChatPopUpComponent!: ChatPopUpComponent;

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) { }

  public allEmployeeList: user[] = [];
  public showLoader: boolean = true;
  public isDepartEmployeeRoute: boolean = false;
  public departID: number = -1;
  public departmentId: number | null = -1;
  public currentPage: number = 1;
  public take: number | null = 5;
  public totalRecords: number = 0;
  public searchString: string | null = "";

  public lEmployeeType: string | null = "";
  public isEmployee: boolean = false;
  public isShowChat: boolean = false;

  public empName: string = "";
  public chatId: number = -1;

  public userChat: getMessageResI[] = [];
  public loggedInUserId: number = -1;

  public recordsPerPage: number = 5;

  public filterChat: getMessageI = {
    isPagination: false,
    index: 0,
    take: 0,
    search: ""
  }

  public userListM: getAllEmployeeI = {
    isPagination: true,
    index: 0,
    take: 5,
    search: null,
    orders: null,
    orderBy: null
  }

  ngOnInit(): void {

    if (localStorage.getItem("loggedInUser_EmployeeType")) {
      this.lEmployeeType = localStorage.getItem("loggedInUser_EmployeeType")
      if (this.lEmployeeType == "Employee") {
        this.isEmployee = true;
      }
    }
    if (localStorage.getItem("departId")) {
      let dp = localStorage.getItem("departId")
      if (dp) {
        this.departmentId = parseInt(JSON.parse(dp));
      }
    }

    this.activatedRoute.queryParams.subscribe(
      (param: Params) => {
        let pageTemp = param['page'];
        this.currentPage = parseInt(pageTemp);
        this.userListM.index = this.currentPage - 1;

        let tempTak = param['take'];
        this.take = parseInt(tempTak);
        this.recordsPerPage = tempTak;

        this.searchString = param['search'];
        this.userListM.search = this.searchString;
        this.showLoader = true;

        this.auth.getAllEmployee(this.userListM).subscribe({
          next: (res: responseTask<user>) => {

            this.totalRecords = res.count;
            this.allEmployeeList = [];
            this.allEmployeeList = res.iterableData;
            this.showLoader = false;
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    )

    if (localStorage.getItem('loogedInUser_EmployeeId')) {
      let id = localStorage.getItem('loogedInUser_EmployeeId');
      if (id) {
        this.loggedInUserId = parseInt(id);
      }
    }


  }

  // public getChats(id: number, name: string) {
  //   this.isShowLoader = true;
  //   this.isShowChat = true;
  //   this.msgReceiverId = id;

  //   this.userService.getChatById(this.msgReceiverId, this.filterChat).subscribe({
  //     next: (res: responseTask<getMessageResI>) => {
  //       this.userChat = res.iterableData;
  //       this.empName = name;
  //       this.isShowLoader = false;
  //       // console.log(this.userChat);
  //     },

  //     error: (err) => console.log(err)

  //   })
  // }

  public assignTask(emp: user) {
    this.router.navigate(['/portal/assignTask'], { queryParams: { id: emp.id } });
  }

  public openChatBox(id: number, name: string) {
    this.chatId = id
    this.empName = name;
    this.isShowChat = true;
  }

  public closeChatBox() {
    this.isShowChat = false;
  }

  public sendMessage(msg: string) {
    let newMsg: { message: string } = {
      message: msg
    }
    this.userService.sendMessageById(this.chatId, newMsg).subscribe({
      next: (res: response3) => {
        if (res.statusCode == 200) {
          this.ChatPopUpComponent.getChats(this.chatId, 0);
          // this.messageBody = "";
          // this.getChatBox();
          // this.getChats(this.msgReceiverId, this.empName);
        }
      },

      error: (err) => console.log(err)

    })
  }


  public getNextEvent(cPage: number) {
    this.router.navigate(['/portal/allEmployee'],
      { queryParams: { page: cPage + 1, search: this.searchString, take: this.userListM.take } })
  }

  public getClickedpageEvent(cPage: number) {
    this.router.navigate(['/portal/allEmployee'],
      { queryParams: { page: cPage, search: this.searchString, take: this.userListM.take } })
  }
  public getTaskPerPageEvent(pTake: number) {
    this.router.navigate(['/portal/allEmployee'],
      { queryParams: { page: 1, search: this.searchString, take: pTake } })
  }
  public getPreviousEvent(cPage: number) {
    this.router.navigate(['/portal/allEmployee'],
      {
        queryParams: { page: this.currentPage - 1, search: this.userListM.search, take: this.userListM.take }
      }
    )
  }
  
}
