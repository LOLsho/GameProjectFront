import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../modules/shared.module';
import { AuthComponent } from './auth.component';
import { SocialsComponent } from './socials/socials.component';
import { StoreModule } from '@ngrx/store';


const ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
    ],
  },
];


@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    AuthComponent,
    SocialsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    // StoreModule.forFeature('auth', authReducer),
  ]
})
export class AuthModule {}
