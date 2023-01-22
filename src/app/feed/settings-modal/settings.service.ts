import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  _fontAdjust!: string;
  _isDark!: boolean;

  constructor() { }

  set fontAdjust(size: string) {
    this._fontAdjust = size;

    localStorage.setItem('fontAdjust', size);
    this.applyFontSize();
  }

  set isDark(checked: boolean) {
    this._isDark = checked;

    localStorage.setItem('theme', checked ? 'dark' : 'light');
    this.applyTheme();
  }

  get fontAdjust(): string {
    return this._fontAdjust;
  }

  get isDark(): boolean {
    return this._isDark;
  }

  private applyFontSize() {
    document.documentElement.style.setProperty(
      '--font-adjust',
      `${this._fontAdjust}%`
    );
  }

  private applyTheme() {
    if (this.isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

  initFontSize(): void {
    const localStorageValue = localStorage.getItem('fontAdjust');
    const computedStyleValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-adjust')
        .replace('%', '');

    console.debug('settings service > font', localStorageValue, computedStyleValue);

    this._fontAdjust = localStorageValue || computedStyleValue;
    this.applyFontSize();
  }

  initDarkTheme() {
    const localStorageValue = localStorage.getItem('theme') === 'dark';
    const matchMediaValue = window.matchMedia('(prefers-color-scheme: dark').matches;

    this._isDark = localStorageValue || matchMediaValue;
    this.applyTheme();
  }
}
