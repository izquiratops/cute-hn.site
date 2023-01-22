import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject, concatMap, map, scan, tap} from 'rxjs';

import {FeedAction, HNItem, TYPES} from '../shared/hn.modal';
import {FirebaseService} from "../shared/firebase.service";
import {environment} from "../../environments/environment";

@Injectable()
export class FeedService {

    feedType = TYPES[0].id;
    scrollPosition: [number, number] = [0, 0];
    private readonly STORIES_PAGE_SIZE = 30;

    private ids: number[] = [];
    private page = 0;

    private feedSlice = new BehaviorSubject<HNItem[]>([]);
    private feedDispatcher = new Subject<FeedAction>();
    private feedReducer = this.feedDispatcher.pipe(
        scan<FeedAction, HNItem[]>((state, action) => {
            environment.showLogs && console.debug('feed > reducer', action, state);
            switch (action.type) {
                case 'concatList':
                    return [...state, ...action.payload] as HNItem[];
                case 'overwriteList':
                    return action.payload;
            }
        }, []),
        tap(() => {
            // TODO: This is confuse, on 'overwriteList' page is 0 and isn't reflected here
            // Every time a page is loaded the index increases +1
            this.page++;
        })
    ).subscribe((res) => this.feedSlice.next(res));

    constructor(
        private fireService: FirebaseService
    ) {
    }

    get feedStories$(): Observable<HNItem[]> {
        return this.feedSlice.asObservable();
    }

    loadFeedByType(): Observable<FeedAction> {
        this.page = 0;

        return this.fireService.getIDsList(this.feedType)
            .pipe(
                // Keep in cache
                tap(res => this.ids = res),
                // Get the 10 first stories
                map(ids => ids.slice(0, this.STORIES_PAGE_SIZE)),
                // Fetch the content
                concatMap(ids => this.fireService.getItemList(ids)),
                // Define action and dispatch it
                map(stories => ({
                    type: 'overwriteList',
                    payload: stories
                } as FeedAction)),
                tap((action) => this.feedDispatcher.next(action))
            );
    }

    loadNextPage(): Observable<FeedAction> {
        const storiesOffset = this.page * this.STORIES_PAGE_SIZE;
        const pageIds = this.ids.slice(storiesOffset, storiesOffset + this.STORIES_PAGE_SIZE);

        return this.fireService.getItemList(pageIds)
            .pipe(
                map(stories => ({
                    type: 'concatList',
                    payload: stories
                } as FeedAction)),
                tap((action) => this.feedDispatcher.next(action)));
    }
}
