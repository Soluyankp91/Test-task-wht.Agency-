import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';

import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { Breed, CatImage, UpdateFilter } from './shared/filters.actions';
import { CatsState } from './shared/filters.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  catBreeds$: Observable<Breed[]>;
  filtersFormGroup = new FormGroup({
    catBreed: new FormControl(null),
    catLimit: new FormControl(10),
  });
  isLoading: BehaviorSubject<boolean>;

  @Select(CatsState.getCats) catsImages$: Observable<CatImage[]>;

  constructor(
    private readonly store: Store,
    private readonly CatsState: CatsState
  ) {}

  ngOnInit(): void {
    this._initialize();
  }
  trackById(index: number, item: CatImage) {
    return item.id;
  }

  clearAllFilters() {
    this.filtersFormGroup.reset({
      catBreed: null,
      catLimit: null,
    });
  }

  private _initialize() {
    this.catBreeds$ = this.CatsState.getAllBreeds();

    this.isLoading = this.CatsState.isCatsImagesLoading$;
    this.filtersFormGroup.valueChanges
      .pipe(
        startWith({ catLimit: 10, catBreed: null }),
        debounceTime(600),
        distinctUntilChanged(isEqual)
      )
      .subscribe((filterData) => {
        this.store.dispatch(
          new UpdateFilter(filterData.catLimit, filterData.catBreed)
        );
      });
  }
}
