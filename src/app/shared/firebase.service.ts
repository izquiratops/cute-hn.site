import {Injectable} from "@angular/core";
import {initializeApp} from 'firebase/app';
import {child, DatabaseReference, get, getDatabase, ref} from 'firebase/database';

import {EMPTY, from, Observable} from 'rxjs';
import {expand, filter, map, mergeMap, pluck, reduce, tap,} from 'rxjs/operators';
import {HNItem} from "./hn.modal";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
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

    getStoryWithReplies(id: number, limit: number = 3): Observable<HNItem> {
        const context = {
            parentNodes: [] as number[],
            siblingNodes: [] as number[],
            currentDepth: -1,
        };

        return this.getItemById(id).pipe(
            // Fetch replies with recursion
            // Item struct:
            //  - 'node' is a ref to itself
            //  - 'parent' ref
            map((replies) => ({node: replies})),
            expand(({node}) => {
                if (context.parentNodes.includes(node.parent)) {
                    context.siblingNodes.push(node.id);
                } else {
                    context.parentNodes = [...context.siblingNodes];
                    context.siblingNodes = [node.id];
                    context.currentDepth++;
                }

                if (node.kids && context.currentDepth < limit) {
                    return from(node.kids).pipe(
                        mergeMap((replyId) => this.getItemById(replyId)),
                        map((reply) => ({
                            node: {
                                ...reply,
                                lazyLoaded: (context.currentDepth === limit) && (reply.kids?.length > 0)
                            }, parent: node
                        })),
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
                tap((item) => environment.showLogs && console.debug('firebase > fetch', item))
            );
    }
}
