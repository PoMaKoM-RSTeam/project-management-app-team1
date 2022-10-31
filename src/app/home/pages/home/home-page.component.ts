import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  currentDate: string = new Date().toDateString();

  constructor() {
    console.log(this.currentDate);
  }
  
}
