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
import { delay, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLang = window.navigator.language.replace(/-.+/gis, '');

  public isLogged$!: Observable<boolean>;

  loading: boolean = true;

  stickyHeader: boolean = false;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    public translate: TranslateService,
    private projectModal: MatDialog,
    private projectsService: ProjectsDataService,
    private userStatusService: UserStatusService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.translate.use(this.currentLang);
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
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.translate.use(this.currentLang);
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
      .pipe(takeUntil(this.destroy$))
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
            .pipe(takeUntil(this.destroy$))
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
