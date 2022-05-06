import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(  private http: HttpClient,) { }

  getMethod(url: string){
    return this.http.get(url);
  }
  postMethod(url: string,body: any){
    return this.http.post(url,body);
  }
}


