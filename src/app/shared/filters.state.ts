import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Breed,
  CatFiltersModel,
  CatImage,
  UpdateFilter,
} from './filters.actions';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { API_BASE_URL } from '../app.module';

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

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private baseUrl: string
  ) {}

  @Selector() static getCats(state: CatFiltersModel): CatImage[] {
    return state.catsImages;
  }

  @Action(UpdateFilter)
  getCats(
    ctx: StateContext<CatFiltersModel>,
    queryParams: { [key: string]: any }
  ) {
    const url = `${this.baseUrl}/images/search`;

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
    const url = `${this.baseUrl}/breeds`;

    return this.http.get<Breed[]>(url);
  }
}
