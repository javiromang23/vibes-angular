import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* import Components Routes */
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TimelineComponent } from './components/timeline/timeline.component';

const routes: Routes = [
  { path: '', component: TimelineComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: '**', component: SignUpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
