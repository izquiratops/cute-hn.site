import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SettingsService} from "./feed/settings-modal/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  @ViewChild('top', {static: true}) topRef!: ElementRef;

  constructor(
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.settingsService.initFontSize();
    this.settingsService.initDarkTheme();
  }

  scrollUp(): void {
    this.topRef.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

}
