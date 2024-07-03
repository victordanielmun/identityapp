import { Component, OnInit } from '@angular/core';
import { AccountService,  } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService,
    private sharedService: SharedService,
    private formBuilder : FormBuilder,
    private router: Router) {
      this.accountService.user$.pipe(take(1)).subscribe({
        next: (user: User | null) => {
          if (user) {
            console.log(user)
            this.router.navigateByUrl('/home')
          }
        }
      })
    }
  
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
  register() {
    this.submitted = true;
    this.errorMessages = [];
    
    if(this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response : any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigate(['/account/login']);
          console.log(response)
        },
        error: (error) => {
          console.log(error)
          if (error.error.errors){
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error)
          }
          
        }
      })

      } else {
        console.log(this.registerForm.valid)
      }
  }
}
