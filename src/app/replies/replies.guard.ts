import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, catchError, map, of} from 'rxjs';
import {RepliesService} from "./replies.service";

@Injectable()
export class RepliesGuard implements CanActivate {

  constructor(
    private router: Router,
    private repliesService: RepliesService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const targetId = Number(route.params['id']);

    return this.repliesService.loadStoryWithReplies(targetId).pipe(
      map(() => true),
      catchError(_ => {
        this.router.navigate(['/feed']);
        return of(false);
      })
    );
  }

}
