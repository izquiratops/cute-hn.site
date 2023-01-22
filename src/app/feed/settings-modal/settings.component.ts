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

  @ViewChild('dialog', {static: true}) dialogRef!: ElementRef;

  constructor(
    private route: Router,
    private scroller: ViewportScroller,
    private settingsService: SettingsService
  ) {
  }

  get fontSize(): number {
    return Number(this.settingsService.fontAdjust);
  }

  get isDarkTheme(): boolean {
    return this.settingsService.isDark;
  }

  closeModal() {
    this.dialogRef.nativeElement.close();
  }

  changeFontAdjust(event: any) {
    this.settingsService.fontAdjust = event.target.value.toString();
  }

  switchTheme(event: any) {
    this.settingsService.isDark = event.target.checked;
  }

}
