import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { enviroment } from '../../enviroments/enviroment';
import { Login } from '../shared/models/login';
import { User } from '../shared/models/user';
import { ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

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

  login(model: Login) {
    console.log(model)
    var headers = { 'content-type': 'application/json'}
    var body = JSON.stringify(model);
    console.log(body)
    var response = this.http.post<User>(`${enviroment.appUrl}/api/account/login`, body,{'headers':headers}).pipe(
      map((user: User) => {
        console.log(user)
        if (user) {
          this.setUser(user);
        }
        
      })
    );
    console.log(response)
    return response
  }

  private setUser(user: User) {
    localStorage.setItem(enviroment.userKey, JSON.stringify(user));
    this.userSource.next(user);

    this.user$.subscribe({
      next: response => console.log(response)
    })
  }
}
