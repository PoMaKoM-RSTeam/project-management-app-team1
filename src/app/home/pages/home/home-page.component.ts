import { UserStatusService } from 'src/app/core/services/user-status.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  currentDate: string = new Date().toDateString();
  
  currentUserName!: string;

  constructor( private userStatusService: UserStatusService) {
  }

  ngOnInit(): void {
    this.userStatusService.getUserLogin().subscribe(value => this.currentUserName  = value);
  }
}
