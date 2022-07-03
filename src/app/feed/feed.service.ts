import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject, concatMap, map, scan, tap} from 'rxjs';

import {FeedAction, HNItem, TYPES} from '../shared/hn.modal';
import {FirebaseService} from "../shared/firebase.service";

@Injectable()
export class FeedService {

    // UI state
    feedType = TYPES[0].id;
    scrollPosition: [number, number] = [0, 0];
    private readonly DEBUG = false;
    private readonly STORIES_PAGE_SIZE = 30;

    // Content-related state
    private ids: number[] = [];
    private page = 0;

    // List of stories
    private feedStore = new BehaviorSubject<HNItem[]>([]);
    private feedDispatcher = new Subject<FeedAction>();
    private feedReducer = this.feedDispatcher.pipe(
        scan<FeedAction, HNItem[]>((currState, action) => {
            this.DEBUG && console.debug('feed reducer', action, currState);
            switch (action.type) {
                case 'concatList':
                    return [...currState, ...action.payload] as HNItem[];
                case 'overwriteList':
                    return action.payload;
            }
        }, []),
        tap(() => {
            // Side Effect: every time a page is loaded the index increases +1
            this.page++;
        })
    ).subscribe((res) => this.feedStore.next(res));

    constructor(
        private fireService: FirebaseService
    ) {
        console.log('heyo!');
    }

    get feedStories$(): Observable<HNItem[]> {
        return this.feedStore.asObservable();
    }

    loadFeedByType(): Observable<FeedAction> {
        // Load again from the first page
        this.page = 0;

        return this.fireService.getIDsList(this.feedType)
            .pipe(
                // Keep in cache
                tap(res => this.ids = res),
                // Get the 10 first stories
                map(ids => ids.slice(0, this.STORIES_PAGE_SIZE)),
                // Fetch the content
                concatMap(ids => this.fireService.getStoriesContent(ids)),
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

        return this.fireService.getStoriesContent(pageIds)
            .pipe(
                map(stories => ({
                    type: 'concatList',
                    payload: stories
                } as FeedAction)),
                tap((action) => this.feedDispatcher.next(action)));
    }
}
