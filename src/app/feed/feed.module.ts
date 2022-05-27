import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {PipesModule} from "../shared/pipes/pipes.module";
import {FeedPageComponent} from './feed-page/feed-page.component';
import {SettingsComponent} from "./settings-modal/settings.component";
import {FeedGuard} from "./feed.guard";
import {FeedService} from "./feed.service";

const routes: Routes = [
  {
    path: 'feed',
    component: FeedPageComponent,
    canActivate: [FeedGuard]
  },
  {
    path: '',
    redirectTo: 'feed'
  }
]


@NgModule({
  declarations: [
    FeedPageComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    FormsModule
  ],
  providers: [
    FeedGuard,
    FeedService
  ]
})
export class FeedModule {
}
