import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {SettingsService} from "./settings.service";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  @ViewChild('about', {static: true}) aboutRef!: ElementRef;

  constructor(
    private route: Router,
    private scroller: ViewportScroller,
    private settingsService: SettingsService
  ) {
  }

  get fontSize(): number {
    return parseInt(this.settingsService.fontSize);
  }

  get isDarkTheme(): boolean {
    return this.settingsService.isDark;
  }

  closeConfigModal() {
    this.aboutRef.nativeElement.close();
  }

  changeFontSize(event: any) {
    this.settingsService.fontSize = event.target.value.toString();
  }

  switchTheme(event: any) {
    this.settingsService.isDark = event.target.checked;
  }

}
