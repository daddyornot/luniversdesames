import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setItem(key: string, value: any): void {
    if (!this.isBrowser) return;
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  clear(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
}
