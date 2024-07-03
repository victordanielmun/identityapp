import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { enviroment } from '../../enviroments/enviroment';
import { Login } from '../shared/models/login';
import { User } from '../shared/models/user';
import { ReplaySubject, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  refreshUser(jwt: string | null) {
    
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    } 
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${jwt}`);

    return this.http.get<User>(`${enviroment.appUrl}/api/account/refresh-user-token`, {headers}).pipe(
      map((user: User) => {
        if(user) {
          this.setUser(user);
        }
      })
    )
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

  register(model: Register) {
    console.log(model)
    var headers = { 'content-type': 'application/json'}
    var body = JSON.stringify(model);
    console.log(body)
    var response = this.http.post(`${enviroment.appUrl}/api/account/register`, body,{'headers':headers});
    console.log(response)
    return response
  }

  logout() {
    localStorage.removeItem(enviroment.userKey);
    this.userSource.next(null);
    this.router.navigate(['/']);
  }

  getJWT() {
    const key = localStorage.getItem(enviroment.userKey);
    if (key) {
      const user = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: User) {
    localStorage.setItem(enviroment.userKey, JSON.stringify(user));
    this.userSource.next(user);

    this.user$.subscribe({
      next: response => console.log(response)
    })
  }
}import { Router } from '@angular/router';

