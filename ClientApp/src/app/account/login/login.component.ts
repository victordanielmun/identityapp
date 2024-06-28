import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false
  errorMessages: string[] = []
  
  constructor(private accountService: AccountService,
    private sharedService: SharedService,
    private formBuilder : FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initializateForm();
  }

  initializateForm() 
  {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],      
    })
  }

  login()
  {
    console.log(this.loginForm.value)
    this.submitted = true;
    this.errorMessages = [];
    
    this.accountService.login(this.loginForm.value).subscribe({
      next: (response: any) => 
        {
          console.log(response)
        },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
