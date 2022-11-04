
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStatusService } from 'src/app/core/services/user-status.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  currentDate: string = new Date().toDateString();

  public userName$!: Observable<string>;

  constructor(private userStatusService: UserStatusService) {
    console.log(this.currentDate);
  }

  ngOnInit(): void {
    this.userName$ = this.userStatusService.getUserName();
  }
}
