export interface FeedAction {
    type: 'concatList' | 'overwriteList',
    payload: HNItem[]
}

export interface StoryAction {
    type: 'loadStory' | 'loadLazyReplies',
    payload: HNItem
}

export interface HNItem {
    id: number; // The item's unique id.
    deleted: boolean; // true if the item is deleted.
    type: string; // The type of item. One of "job", "story", "comment", "poll", or "pollopt".
    by: string; // The username of the item's author.
    time: number; // Creation date of the item, in Unix Time.
    text: string; // The comment, story or poll text. HTML.
    dead: boolean; // true if the item is dead.
    parent: number; // The comment's parent: either another comment or the relevant story.
    poll: number; // The pollopt's associated poll.
    kids: number[]; // The ids of the item's comments, in ranked display order.
    url: string; // The URL of the story.
    score: number; // The story's score, or the votes for a pollopt.
    title: string; // The title of the story, poll or job. HTML.
    parts: number[]; // A list of related pollopts, in display order.
    descendants: number; // In the case of stories or polls, the total comment count.
    replies: HNItem[]; // The objects of the item's comments, this contains all the data to bind into the tree.
    lazyLoaded: boolean;
}

export interface InterfaceType {
    id: StoryTypeId;
    label: string;
    icon: string;
}

export const TYPES: InterfaceType[] = [
    {
        id: 'topstories',
        label: 'Top',
        icon: 'whatshot'
    },
    {
        id: 'beststories',
        label: 'Best',
        icon: 'favorite'
    },
    {
        id: 'newstories',
        label: 'New',
        icon: 'new_releases'
    },
    {
        id: 'askstories',
        label: 'Ask',
        icon: 'help'
    },
    {
        id: 'showstories',
        label: 'Show',
        icon: 'preview'
    },
    {
        id: 'jobstories',
        label: 'Job',
        icon: 'work'
    },
];

export type StoryTypeId = 'topstories' | 'beststories' | 'newstories' | 'askstories' | 'showstories' | 'jobstories';

export const ItemTypes = [
  'job',
  'story',
  'comment',
  'poll',
  'pollopt'
];
