import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { responseTask } from 'src/app/Generics/GenericResponse';
import { getMessageI, getMessageResI } from 'src/app/Models/chats.model';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-chat-pop-up',
  templateUrl: './chat-pop-up.component.html',
  styleUrls: ['./chat-pop-up.component.scss']
})
export class ChatPopUpComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() employeeName!: string;
  @Input() chatId!: number;

  @Input() loggedInUserId!: number;

  @Output() closePopUp = new EventEmitter();
  @Output() sendMessageE = new EventEmitter<string>();
  @Output() deleteMessageE = new EventEmitter<number>();

  @ViewChildren('messages') messages!: QueryList<any>;
  @ViewChild('content') content!: ElementRef;

  public userChat: getMessageResI[] = [];
  public isShowSpinner: boolean = true;
  public isApiCalled: boolean = false;
  public cPageChatLength: number = 0;

  private subcription!: Subscription;


  public filterChat: getMessageI = {
    isPagination: true,
    index: 0,
    take: 7,
    search: ""
  }

  constructor(private userService: UserService, private messageService: MessageService, private tService: ToastrService) { }

  ngOnInit(): void {
    this.userChat = [];
    this.filterChat.index = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']?.currentValue) {
      if (changes['chatId']?.previousValue != changes['chatId']?.currentValue) {

        this.chatId = changes['chatId']?.currentValue;
        this.getChats(this.chatId, 0);
      }
    }
  }

  ngAfterViewChecked(): void {
    // this.scrollToBottom();
  }

  public closePopupChatBox() {
    this.subcription.unsubscribe();
    this.closePopUp.emit();
  }

  public sendMessage(msg: HTMLInputElement) {
    this.sendMessageE.emit(msg.value);

    msg.value = "";
  }

  public deleteMsg(id: number) {
    let data: number[] = [];
    data.push(id);
    this.messageService.deleteMessage(data).subscribe({
      next: (res) => {
        this.tService.success("message deleted successfully");
        this.getChats(this.chatId, 0);
      },

      error: (err) => {
        this.tService.error(err.message);
        console.log(err);
      }
    })
  }

  public onScrollUp(event: Event) {

    const element = this.content.nativeElement;
    const scrolltop = element.scrollTop;
    // const isAtBottom = element.scrollHeight * 0.2;

    if (this.cPageChatLength == this.filterChat.take) {
      // if (scrolltop <= isAtBottom && !this.isApiCalled) {
      if (scrolltop ==0 && !this.isApiCalled) {
        this.isApiCalled = true;

        this.filterChat.index++;
        this.userService.getChatById(this.chatId, this.filterChat).subscribe({
          next: (res: responseTask<getMessageResI>) => {
            this.cPageChatLength = res.iterableData.length;

            for(let i=res.iterableData.length-1; i>-1; i--){
              this.userChat.unshift(res.iterableData[i]);
            }
            // res.iterableData.map(
            //   (msg) => {
            //     this.userChat.unshift(msg);
            //   }
            // )
            this.isApiCalled = false;
          },

          error: (err) => {
            this.tService.error(err.message);
            this.isShowSpinner = false;
            this.isApiCalled = true;
          }

        })
      }
    }
  }


  ngAfterViewInit() {
    // this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  public getChats(cId: number, i: number) {
    this.filterChat.index = i;

    this.subcription = this.userService.getChatById(cId, this.filterChat).subscribe({
      next: (res: responseTask<getMessageResI>) => {
        this.cPageChatLength = res.iterableData.length;
        this.userChat = res.iterableData;
        this.isShowSpinner = false;
      },

      error: (err) => {
        this.tService.error(err.message);
        this.isShowSpinner = false;
      }

    })
  }


  private scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
