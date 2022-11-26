import { Router } from '@angular/router';
import {
  switchMap,
  map,
  Observable,
  fromEvent,
  throttleTime,
  Subject,
} from 'rxjs';
import { ProjectsDataService } from './../../services/projects-data.service';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditModel } from './../../models/dialog.model';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserStatusService } from '../../services/user-status.service';
import { LoadingService } from '../../services/loading.service';
import { delay, take, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AppStatusService } from '../../services/app-status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentLang$!: Observable<string>;

  public isLogged$!: Observable<boolean>;

  public loading: boolean = true;

  public stickyHeader: boolean = false;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    public translate: TranslateService,
    private projectModal: MatDialog,
    private projectsService: ProjectsDataService,
    private appStatusService: AppStatusService,
    private userStatusService: UserStatusService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.currentLang$ = this.appStatusService.getCurrentLang().pipe(
      map((currentLang: string) => {
        this.translate.use(currentLang);
        this.cdr.detectChanges();
        return currentLang;
      })
    );
    this.isLogged$ = this.userStatusService.getLoginStatus();
    this.listenToLoading();
    fromEvent(window, 'scroll')
      .pipe(throttleTime(50), takeUntil(this.destroy$))
      .subscribe(() => {
        this.stickyHeader = this.document.defaultView!.scrollY > 80;
        this.cdr.detectChanges();
      });
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0), takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
        this.cdr.detectChanges();
      });
  }

  switchLang(lang: string) {
    if (this.appStatusService.currentLang.value === lang) {
      return;
    }
    this.appStatusService.currentLang.next(lang);
  }

  createProject() {
    this.router.navigate(['home']);
    const dialogData: ICreateEditModel = {
      title: 'Project-modal-add-title',
      titleLabel: 'Project-modal-title',
      descriptionLabel: 'Project-modal-description',
      commandName: 'Project-modal-add',
    };

    const dialogRef = this.projectModal.open(CreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.projectsService
            .createProject(
              dialogResult[0],
              dialogResult[1],
              this.userStatusService.userId
            )
            .pipe(
              switchMap(() =>
                this.projectsService.getProjects().pipe(map((value) => value))
              )
            )
            .pipe(take(1))
            .subscribe();
        }
      });
  }

  changeDetection() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
