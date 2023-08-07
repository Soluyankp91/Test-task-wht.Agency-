import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Breed,
  CatFiltersModel,
  CatImage,
  UpdateFilter,
} from './filters.actions';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';

@State<CatFiltersModel>({
  name: 'filterState',
  defaults: {
    catsImages: [],
  },
})
@Injectable()
export class CatsState {
  headers = new HttpHeaders({
    'x-api-key':
      'live_oue2Jegx22hz7ZUr6r2gPeT3014f6shTGlNnQbKdglSR4EaX2AqxCUY6sXQeL5co',
  });

  isCatsImagesLoading$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  @Selector() static getCats(state: CatFiltersModel): CatImage[] {
    return state.catsImages;
  }

  @Action(UpdateFilter)
  getCats(ctx: StateContext<CatFiltersModel>, queryParams: any) {
    const url = 'https://api.thecatapi.com/v1/images/search';

    let params = new HttpParams();
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (key && queryParams[key]) {
          params = params.append(key, queryParams[key]);
        }
      });
    }
    this.isCatsImagesLoading$.next(true);
    return this.http
      .get<CatImage[]>(url, { headers: this.headers, params })
      .pipe(
        tap((catsImages) => {
          this.isCatsImagesLoading$.next(false);
          ctx.setState({ catsImages });
        })
      );
  }

  getAllBreeds(): Observable<Breed[]> {
    const url = 'https://api.thecatapi.com/v1/breeds';

    return this.http.get<Breed[]>(url);
  }
}
