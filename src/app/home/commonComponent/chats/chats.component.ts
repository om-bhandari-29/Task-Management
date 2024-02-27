import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { chatBox, response, response3, responseTask } from 'src/app/Generics/GenericResponse';
import { getMessageI, getMessageResI } from 'src/app/Models/chats.model';
import { user } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';
import { ChatPopUpComponent } from 'src/app/commomComponent/chat-pop-up/chat-pop-up.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  public chatList: {
    id: number,
    name: string,
    message: string,
    isSeen: boolean
  }[] = [];

  public userChat: getMessageResI[] = [];
  public loggedInUserId: number = -1;
  public empName: string = "Message";
  public messageBody: string = "";
  public msgReceiverId: number = -1;
  public isShowLoader: boolean = true;

  public chatId: number = -1;

  public isShowChat: boolean = false;

  public employeeList: user[] = [];

  // for searching name in unput field
  public searchedEmployeeList: user[] = [];
  public searchStr: string = "";
  public empType: string = "";


  public filterChat: getMessageI = {
    isPagination: false,
    index: 0,
    take: 0,
    search: ""
  }


  @ViewChildren('messages') messages!: QueryList<any>;
  @ViewChild('content') content!: ElementRef;

  @ViewChild(ChatPopUpComponent) ChatPopUpComponent !: ChatPopUpComponent;

  constructor(private userService: UserService, private authService: AuthService, private messageService: MessageService, private toS: ToastrService) { }

  ngOnInit(): void {
    this.getChatBox();
    // this.scrollToBottom();
    
    this.localStorageCalls();
  }

  public getChats(id: number, name: string) {
    this.chatId = id;
    this.empName = name;
    this.isShowChat = true;
    this.msgReceiverId = id;
  

    // this.ChatPopUpComponent?.getChats(this.chatId, 0);

    // this.isShowLoader = true;

    // this.userService.getChatById(this.msgReceiverId, this.filterChat).subscribe({
    //   next: (res: responseTask<getMessageResI>) => {
    //     this.userChat = res.iterableData;
    //     this.empName = name;
    //     this.isShowLoader = false;
    //     console.log(this.userChat);
    //   },

    //   error: (err) => console.log(err)

    // })
  }

  public closeChatBox(){
    this.isShowChat = false;
  }

  public sendMessage(msg: string) {
    let newMsg: { message: string } = {
      message: msg
    }
    this.userService.sendMessageById(this.msgReceiverId, newMsg).subscribe({
      next: (res: response3) => {
        if (res.statusCode == 200) {
          this.getChatBox();
          this.ChatPopUpComponent?.getChats(this.msgReceiverId, 0);
        }
      },

      error: (err) => console.log(err)

    })
  }

  public deleteMsg(id: number){
    console.log(id, typeof id);
    let data: number[] = [];
    data.push(id);
     this.messageService.deleteMessage(data).subscribe({
      next: (res) =>{
        this.getChats(this.msgReceiverId, this.empName);
        console.log(res);
        this.toS.success("message deleted successfully");
      },

      error: (err) =>{
        this.toS.error(err.message);
        console.log(err);
      }
     })
  }

  public searchStrFn(){
    if(this.searchStr == ""){
      this.searchedEmployeeList = [];
    }
    else{
      this.searchedEmployeeList = this.employeeList.filter(
        (emp) => {
          return emp.name.toLocaleLowerCase().match(this.searchStr.toLocaleLowerCase());
        }
      )
    }
  }

  private getAllEmployee(){
    let filterObj = {
      "isPagination": false,
      "index": 0,
      "take": 0,
      "search": "",
      "orders": null,
      "orderBy": ""
    }
    
    this.isShowLoader = true;
    this.authService.getAllEmployee(filterObj).subscribe({
      next: (res: responseTask<user>) =>{
        this.employeeList = res.iterableData;
        this.isShowLoader = false;
      },

      error: (err) =>{
        console.log(err);
        this.isShowLoader = false;
      }
    })
  }
  

  private localStorageCalls(){
    if (localStorage.getItem('loogedInUser_EmployeeId')) {
      let id = localStorage.getItem('loogedInUser_EmployeeId');
      if (id) {
        this.loggedInUserId = parseInt(id);
      }
    }
      
    if (localStorage.getItem('loggedInUser_EmployeeType')) {
      let eT = localStorage.getItem('loggedInUser_EmployeeType');
      if (eT) {
        this.empType = eT;
        if(eT == 'SuperAdmin' || eT == 'Admin'){
          this.getAllEmployee();
        }
      }
    }
  }


  private getChatBox() {
    this.isShowLoader = true;
    this.userService.getChatBox().subscribe({
      next: (res: response<chatBox>) => {
        this.chatList = [];
        res.iterableData.map(
          (msg: chatBox) => {

            if (msg.employeeId != this.loggedInUserId) {
              let newM = {
                id: msg.employeeId,
                name: msg.employeeName,
                message: msg.lastMessage,
                isSeen: msg.isSeen
              }

              this.chatList.push(newM);
            }
            if (msg.recieverId != this.loggedInUserId) {
              let newM = {
                id: msg.recieverId,
                name: msg.recieverName,
                message: msg.lastMessage,
                isSeen: msg.isSeen
              }
              this.chatList.push(newM);
            }
          }
        )
        
        // if(this.chatList.length > 0){
        //   this.chatId = this.chatList[0].id;
        //   this.isShowChat = true;
        // }
        this.isShowLoader = false;
      },

      error: (err) => {
        console.log(err);
        this.isShowLoader = false;
      }
    })
  }

  public trackByUserChatIdFn(index: number, chat: getMessageResI): number {
    return chat.id;
  }

}
