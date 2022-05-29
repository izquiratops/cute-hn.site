import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ViewportScroller} from "@angular/common";

import {map, Observable} from "rxjs";
import {pluck} from "rxjs/operators";
import {RepliesService} from "../replies.service";

@Component({
  selector: 'app-replies-page',
  templateUrl: './replies-page.component.html',
  styleUrls: ['./replies-page.component.css']
})
export class RepliesPageComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private scroller: ViewportScroller,
    private repliesService: RepliesService
  ) {
  }

  ngOnInit() {
    this.scroller.scrollToPosition([0, 0]);
  }

  get story() {
    return this.repliesService.story$;
  }

  get replies() {
    return this.repliesService.story$.pipe(
      pluck('replies')
    );
  }

  // Safety first, lxds 🪖
  // https://angular.io/guide/security#trusting-safe-values
  get trustedUrl(): Observable<SafeUrl> {
    return this.repliesService.story$.pipe(
      pluck('url'),
      map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url) ),
    );
  }

  /* TODO: try this with HTTPS
  // Get current value of Story$

  handleSharePost() {
    console.log('sharing...');

    if (navigator.share) {
      navigator.share({
        title: 'web.dev',
        text: 'Check out web.dev.',
        url: 'https://web.dev/',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  } */

}
