import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';

import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { Breed, CatImage, UpdateFilter } from './shared/filters.actions';
import { CatsState } from './shared/filters.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  catBreeds$: Observable<Breed[]>;
  filtersFormGroup = new FormGroup({
    catBreed: new FormControl(null),
    catLimit: new FormControl(10),
  });
  isLoading: BehaviorSubject<boolean>;

  private _unsubribe$ = new Subject<void>();

  @Select(CatsState.getCats) catsImages$: Observable<CatImage[]>;

  constructor(
    private readonly store: Store,
    private readonly CatsState: CatsState
  ) {}

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._unsubribe$.next();
    this._unsubribe$.complete();
  }

  trackById(index: number, item: CatImage) {
    return item.id;
  }

  clearAllFilters(): void {
    this.filtersFormGroup.reset({
      catBreed: null,
      catLimit: null,
    });
  }

  private _initialize(): void {
    this.catBreeds$ = this.CatsState.getAllBreeds();

    this.isLoading = this.CatsState.isCatsImagesLoading$;
    this.filtersFormGroup.valueChanges
      .pipe(
        startWith({ catLimit: 10, catBreed: null }),
        debounceTime(600),
        distinctUntilChanged(isEqual),
        takeUntil(this._unsubribe$)
      )
      .subscribe((filterData) => {
        this.store.dispatch(
          new UpdateFilter(filterData.catLimit, filterData.catBreed)
        );
      });
  }
}
