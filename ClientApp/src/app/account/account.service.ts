import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { enviroment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  register(model: Register) {
    console.log(model)
    var headers = { 'content-type': 'application/json'}
    var body = JSON.stringify(model);
    console.log(body)
    var response = this.http.post(`${enviroment.appUrl}/api/account/register`, body,{'headers':headers});
    console.log(response)
    return response
  }
}
