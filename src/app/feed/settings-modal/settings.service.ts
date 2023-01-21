import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  _isDark!: boolean;
  _fontSize!: string;

  constructor() { }

  /* -------- Font Size --------- */

  set fontSize(size: string) {
    this._fontSize = size;

    localStorage.setItem('fontSize', size);
    this.applyFontSize();
  }

  get fontSize(): string {
    return this._fontSize;
  }

  initFontSize(): void {
    const localStorageValue = localStorage.getItem('fontSize');
    const computedStyleValue = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-font-size')
      .replace('px', '');

    this._fontSize = localStorageValue || computedStyleValue;
    this.applyFontSize();
  }

  private applyFontSize() {
    document.documentElement.style.setProperty(
      '--theme-font-size',
      `${this._fontSize}px`
    );
  }

  /* -------- Dark Theme -------- */

  set isDark(checked: boolean) {
    this._isDark = checked;

    localStorage.setItem('theme', checked ? 'dark' : 'light');
    this.applyTheme();
  }

  get isDark(): boolean {
    return this._isDark;
  }

  initDarkTheme() {
    const localStorageValue = localStorage.getItem('theme') === 'dark';
    const matchMediaValue = window.matchMedia('(prefers-color-scheme: dark').matches;

    this._isDark = localStorageValue || matchMediaValue;
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }
}
