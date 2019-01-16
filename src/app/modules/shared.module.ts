import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'angular-l10n';
import { MaterialModule } from './material.module';


const sharedModules = [
  HttpClientModule,
  ReactiveFormsModule,
  TranslationModule,
  MaterialModule,
];


@NgModule({
  declarations: [],
  imports: sharedModules,
  exports: sharedModules,
})
export class SharedModule { }
