import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatButtonModule, MatSelectModule, MatBadgeModule, MatMenuModule, MatDialogModule,
} from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';


const matElements = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatBadgeModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  DragDropModule,
];


@NgModule({
  imports: matElements,
  exports: matElements,
})
export class MaterialModule {}
