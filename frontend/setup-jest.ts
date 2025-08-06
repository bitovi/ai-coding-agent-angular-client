import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

const testEnvironmentOptions =
  (globalThis as any).ngJest?.testEnvironmentOptions ?? Object.create(null);

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
  testEnvironmentOptions
);
