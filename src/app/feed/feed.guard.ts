import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, iif, map, of, switchMap, take} from 'rxjs';
import {FeedService} from "./feed.service";

@Injectable()
export class FeedGuard implements CanActivate {

    constructor(
        private feedService: FeedService
    ) {
    }

    readonly loadFeedByType$ = this.feedService.loadFeedByType()
        .pipe(map(() => true));

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.feedService.feedStories$.pipe(
            take(1),
            switchMap((feed) =>
                // Have we already fetched some data?
                iif(() => feed.length > 0,
                    // Data is cached, no need to download again
                    of(true),
                    // First load case scenario
                    this.loadFeedByType$
                )))
    }

}
