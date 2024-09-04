import { PlatformLocation } from '@angular/common';
import {Injectable, enableProdMode, inject} from '@angular/core';
import { BaseConfiguration } from './base.config';
import {LocalhostEmulators} from './localhost-emulators'

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  configuration = BaseConfiguration
  constructor(private platformLocation: PlatformLocation) {
    const url = this.getUrl();
    switch (url) {
      case 'http://localhost:4200':
        break;

      case 'http://localhost:4000':
        this.configuration = {
          ...this.configuration,
          ...LocalhostEmulators
        };
        break;
      default:
        break;
    }

    // set production mode
    if (this.configuration.production) {
      enableProdMode();
    }
  }

  private getUrl() {
    const loc: any = this.platformLocation;
    // eslint-disable-next-line no-underscore-dangle
    const url = loc._location.origin;
    return url;
  }
}
