import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string | undefined;

  constructor (private HomeService: HomeService) { }

  ngOnInit(): void {
    this.HomeService.getPlayers().subscribe({
      next: (response: any) => this.message = response.value.message,
      error: error => console.log(error)
      })
    }
  }