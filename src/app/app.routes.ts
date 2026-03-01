import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { GeneratorComponent } from './generator';
import { AnalysisComponent } from './analysis';
import { ProfileComponent } from './profile';
import { LoginComponent } from './login';
import { SignupComponent } from './signup';
import { HistoryComponent } from './history';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generator', component: GeneratorComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
