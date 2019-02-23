import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'angular-l10n';
import { MaterialModule } from './material.module';
import { LoaderComponent } from '../elements/loader/loader.component';


const sharedModules = [
  HttpClientModule,
  ReactiveFormsModule,
  TranslationModule,
  MaterialModule,
];

const sharedComponents = [
  LoaderComponent,
];


@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule { }
