import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';

import {RepliesGuard} from './replies.guard';
import {RepliesPageComponent} from './replies-page/replies-page.component';
import {RepliesService} from "./replies.service";
import {PipesModule} from "../shared/pipes/pipes.module";

const routes: Routes = [
  {
    path: ':id',
    component: RepliesPageComponent,
    canActivate: [RepliesGuard]
  },
  {
    path: '',
    redirectTo: '..',
    pathMatch: 'full',
  }
]

@NgModule({
  declarations: [
    RepliesPageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        PipesModule
    ],
  providers: [
    RepliesGuard,
    RepliesService
  ]
})
export class RepliesModule {
}
