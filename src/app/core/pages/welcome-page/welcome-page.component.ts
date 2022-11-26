import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserStatusService } from '../../services/user-status.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent implements OnInit {
  link: string = '/login';

  constructor(private userStatusService: UserStatusService) {
  }

  ngOnInit() {
    this.link =  this.userStatusService.isAuthenticated() ? '/home' : '/login';
  }
}
