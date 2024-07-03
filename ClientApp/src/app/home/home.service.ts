import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getPlayers() {
    var headers = { 'content-type': 'application/json'}
    var response = this.http.get(`${enviroment.appUrl}/api/play/get-players`);
    console.log(response)
    return response
    
  }

 
}
