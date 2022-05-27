import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, map, switchMap, take, iif, of} from 'rxjs';
import {FeedService} from "./feed.service";

@Injectable()
export class FeedGuard implements CanActivate {

  constructor(
    private feedService: FeedService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const loadFeedByType$ = this.feedService.loadFeedByType().pipe(
      map(() => true)
    );

    return this.feedService.feedStories$.pipe(
      // Have we already fetched some data?
      take(1),
      switchMap((feed) => iif(() => feed.length > 0,
        // Data is cached, no need to download again
        of(true),
        // First load case scenario
        loadFeedByType$
      )))
  }

}
