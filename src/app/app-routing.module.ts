import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* import Components Routes */
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicationComponent } from './components/publication/publication.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: '', component: TimelineComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'u/:username', component: ProfileComponent },
  { path: 'p/:publication', component: PublicationComponent },
  { path: 'edit/:username', component: EditProfileComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
