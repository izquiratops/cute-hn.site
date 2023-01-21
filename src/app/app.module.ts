import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feed/feed.module').then(m => m.FeedModule),
  },
  {
    path: 'replies',
    loadChildren: () => import('./replies/replies.module').then(m => m.RepliesModule),
    pathMatch: 'prefix',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
