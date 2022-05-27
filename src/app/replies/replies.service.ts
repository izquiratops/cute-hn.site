import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {FirebaseService} from "../shared/firebase.service";
import {HNItem} from "../shared/hn.modal";

@Injectable()
export class RepliesService {

  private readonly DEBUG = false;
  private _story$ = new BehaviorSubject<HNItem>({} as HNItem);

  constructor(
    private firebase: FirebaseService
  ) {
  }

  get story$(): Observable<HNItem> {
    return this._story$.asObservable();
  }

  loadStoryWithReplies(id: number): Observable<HNItem> {
    return this.firebase.getStoryWithReplies(id).pipe(
      tap(res => {
        this.DEBUG && console.debug(res);
        this._story$.next(res);
      })
    );
  }

}
