import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'angular-l10n';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    TranslationModule,
    MaterialModule,
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    TranslationModule,
    MaterialModule,
  ],
})
export class SharedModule { }
