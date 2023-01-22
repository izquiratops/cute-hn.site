import {Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, from, map, Observable, scan, Subject, tap} from "rxjs";
import {FirebaseService} from "../shared/firebase.service";
import {HNItem, StoryAction} from "../shared/hn.modal";
import {environment} from "../../environments/environment";

@Injectable()
export class RepliesService {

    private storySlice = new BehaviorSubject<HNItem>({} as HNItem);
    private storyDispatcher = new Subject<StoryAction>();
    private storyReducer = this.storyDispatcher.pipe(
        scan<StoryAction, HNItem>((state, action) => {
            environment.showLogs && console.debug('story > reducer', action, state);
            switch (action.type) {
                case 'loadStory':
                    return action.payload;
                case 'loadLazyReplies':
                    return {...state};
            }
        }, {} as HNItem),
    ).subscribe((res) => this.storySlice.next(res));

    constructor(
        private firebase: FirebaseService
    ) {
    }

    get storyItem$(): Observable<HNItem> {
        return this.storySlice.asObservable();
    }

    loadStory(id: number) {
        return this.firebase.getItemRecursively(id, 3).pipe(
            map(story => ({
                type: 'loadStory',
                payload: story
            } as StoryAction)),
            tap(action => this.storyDispatcher.next(action))
        );
    }

    loadLazyReplies(item: HNItem) {
        return from(item.kids).pipe(
            concatMap(id => this.firebase.getItemRecursively(id)),
            map(story => ({
                type: 'loadStory',
                payload: story
            } as StoryAction)),
            tap(action => this.storyDispatcher.next(action))
        );
    }

}
