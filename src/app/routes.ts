import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ViewerComponent} from './viewer/viewer.component';

const SCREENSHOT_ROUTES: Routes = [
  {path: '', component: ViewerComponent, pathMatch: 'full'},
  {path: 'pr/:id', component: ViewerComponent},
  {path: 'approve/:id', component: ViewerComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(SCREENSHOT_ROUTES);