import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  public deleteMessage(data: number[]){
    const url = `${this.baseUrl}/api/CommunityMessage/DeleteMessage`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ids: data
      },
    };
    return this.httpClient.delete(url, options);
  }
}
