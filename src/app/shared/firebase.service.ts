import {Injectable} from "@angular/core";
import {initializeApp} from 'firebase/app';
import {DatabaseReference, child, get, getDatabase, ref} from 'firebase/database';

import {EMPTY, from, Observable} from 'rxjs';
import {expand, filter, map, mergeMap, pluck, reduce, tap,} from 'rxjs/operators';
import {HNItem} from "./hn.modal";

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private readonly DEBUG = false;
    private readonly VERSION = '/v0';
    private readonly DATABASE;

    constructor() {
        const app = initializeApp({
            databaseURL: 'https://hacker-news.firebaseio.com'
        });
        const database = getDatabase(app);
        this.DATABASE = ref(database);
    }

    getIDsList(type: string): Observable<number[]> {
        const dbQuery = child(this.DATABASE, `${this.VERSION}/${type}`);
        return this.fetchFromDatabase<number[]>(dbQuery);
    }

    getStoriesContent(indices: number[]): Observable<HNItem[]> {
        return from(indices).pipe(
            mergeMap((id) => this.getItemById(id)),
            reduce((acc, curr) => {
                acc.push(curr);
                return acc;
            }, [] as HNItem[])
        );
    }

    getStoryWithReplies(id: number): Observable<HNItem> {
        return this.getItemById(id).pipe(
            // Fetch replies with recursion
            // Item struct:
            //  - 'node' is a ref to itself
            //  - 'parent' ref
            map((replies) => ({node: replies})),
            expand(({node}) => {
                if (node.kids) {
                    return from(node.kids).pipe(
                        mergeMap((replyId) => this.getItemById(replyId)),
                        map((reply) => ({node: reply, parent: node}))
                    );
                } else {
                    return EMPTY;
                }
            }),
            reduce((acc, {node, parent}) => {
                if (parent.replies) {
                    parent.replies.push(node);
                } else {
                    parent.replies = [node];
                }
                return acc;
            }),
            // Pluck into node because there's no parent on root
            pluck('node')
        );
    }

    getItemById(id: number) {
        const dbQuery = child(this.DATABASE, `${this.VERSION}/item/${id}`);
        return this.fetchFromDatabase<HNItem>(dbQuery)
    }

    private fetchFromDatabase<T>(dbQuery: DatabaseReference): Observable<T> {
        return from(get(dbQuery))
            .pipe(
                map(snapshot => snapshot.val()),
                filter((item) => !item.deleted),
                tap((item) => this.DEBUG && console.debug(item))
            );
    }
}
