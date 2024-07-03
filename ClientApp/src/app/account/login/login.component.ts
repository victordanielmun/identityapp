import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false
  errorMessages: string[] = []
  returnUrl: string | null = null;
  
  constructor(public accountService: AccountService,
    private formBuilder : FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.accountService.user$.pipe(take(1)).subscribe({
        next: (user: User | null) => {
          if (user) {
            console.log(user)
            this.router.navigateByUrl('/home')
          } else {
            this.activatedRoute.queryParamMap.subscribe({
              next: (params: any) => {
                if (params) {
                  console.log(params.get('returnUrl'))
                  this.returnUrl = params.get('returnUrl');
                }
              }
            })
          }
        }
      })
     }

  ngOnInit(): void {
    this.initializateForm();
  }

  initializateForm() 
  {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],      
    })
  }

  login()
  {
    console.log(this.loginForm.value)
    this.submitted = true;
    this.errorMessages = [];
    
    if (this.loginForm.valid) { 
      this.accountService.login(this.loginForm.value).subscribe({
        next: (response: any) => 
          {
            console.log(this.returnUrl);
           if(this.returnUrl){
            this.router.navigateByUrl(this.returnUrl);
           } else {
            this.router.navigateByUrl('/home');
           }
          },
        error: error => {
          console.log(error)
          if(error.error.errors){
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error)
          }
        }
      })
     }
  }
}
