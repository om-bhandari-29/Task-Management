import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { chatBox, response, response3, responseTask } from '../Generics/GenericResponse';
import { getMessageI, getMessageResI } from '../Models/chats.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  public getChatBox(): Observable<response<chatBox>>{
    const url = `${this.baseUrl}/api/CommunityMessage/GetChatBox`;
    return this.httpClient.get<response<chatBox>>(url);
  }

  public getChatById(id: number, filterChat: getMessageI): Observable<responseTask<getMessageResI>>{
    const url = `${this.baseUrl}/api/CommunityMessage/DisplayMessage/${id}`;
    return this.httpClient.post<responseTask<getMessageResI>>(url, filterChat);
  }
  
  
  public sendMessageById(id: number, msg: {message: string}):Observable<response3>{
    const url = `${this.baseUrl}/api/CommunityMessage/SendMessage/${id}`;
    return this.httpClient.post<response3>(url, msg);
  }
}
