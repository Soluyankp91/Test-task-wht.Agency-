import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { CatsState } from './filters.state';
import { NgxsModule } from '@ngxs/store';

const MaterialModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatProgressSpinnerModule,
];
@NgModule({
  declarations: [],
  providers: [CatsState],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([CatsState], {
      developmentMode: true,
    }),
    ...MaterialModules,
  ],
  exports: [...MaterialModules, ReactiveFormsModule],
})
export class SharedModule {}
