import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'angular-l10n';
import { MaterialModule } from './material.module';
import { LoaderComponent } from '../elements/loader/loader.component';
import { StatusIndicatorComponent } from '../elements/status-indicator/status-indicator.component';
import { UserPhotoComponent } from '../elements/user-photo/user-photo.component';
import { SelectMenuComponent } from '../elements/select-menu/select-menu.component';
import { CommonModule } from '@angular/common';
import { MaxLengthPipe } from '../pipes/max-length.pipe';


const sharedModules = [
  HttpClientModule,
  ReactiveFormsModule,
  TranslationModule,
  MaterialModule,
];

const sharedComponents = [
  LoaderComponent,
  StatusIndicatorComponent,
  UserPhotoComponent,
  SelectMenuComponent,
  MaxLengthPipe,
];


@NgModule({
  declarations: sharedComponents,
  imports: [
    sharedModules,
    CommonModule,
  ],
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule { }
