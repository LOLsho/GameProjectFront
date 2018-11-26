import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SapperComponent} from './sapper.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [SapperComponent],
  declarations: [SapperComponent],
})
export class SapperModule {
}
