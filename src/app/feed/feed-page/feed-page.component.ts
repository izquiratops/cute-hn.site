import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ViewportScroller} from "@angular/common";

import {Observable} from 'rxjs';
import {FeedService} from 'src/app/feed/feed.service';
import {SettingsComponent} from "../settings-modal/settings.component";
import {HNItem, InterfaceType, StoryTypeId, TYPES} from 'src/app/shared/hn.modal';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.css']
})
export class FeedPageComponent implements AfterViewInit {

  @ViewChild(SettingsComponent, {static: true}) settingsRef!: SettingsComponent;

  constructor(
    private scroller: ViewportScroller,
    private feedService: FeedService
  ) {
  }

  ngAfterViewInit() {
    this.scroller.scrollToPosition(this.feedService.scrollPosition);
  }

  trackById(_: number, story: HNItem): number {
    return story.id;
  }

  get types(): InterfaceType[] {
    return TYPES;
  }

  get feedType(): StoryTypeId {
    return this.feedService.feedType;
  }

  get stories(): Observable<HNItem[]> {
    return this.feedService.feedStories$;
  }

  saveScrollPosition() {
    this.feedService.scrollPosition = this.scroller.getScrollPosition();
  }

  showConfigModal(): void {
    this.settingsRef.aboutRef.nativeElement.showModal();
  }

  reloadFeedList(event: any): void {
    this.feedService.feedType = event.target.value;
    this.refreshFeedList();
  }

  refreshFeedList(): void {
    this.feedService.loadFeedByType().subscribe();
  }

  loadNextPage(): void {
    this.feedService.loadNextPage().subscribe();
  }

}
