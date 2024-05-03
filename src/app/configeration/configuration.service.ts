import { PlatformLocation } from '@angular/common';
import { Injectable, enableProdMode } from '@angular/core';
import { BaseConfiguration } from './base.config';
import { EnvApiLocalhostConfiguration } from './env-api-localhost.config';
import { TenantReliableConfiguration } from './tenant-reliable.config';
import { EnvAzureProdConfiguration } from './env-azure-prod.config';
import { EnvAzureDevConfiguration } from './env-azure-dev.config copy';
import { holidays } from './holidays.config';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  configuration = BaseConfiguration
  constructor(private platformLocation: PlatformLocation) {
    const url = this.getUrl();
    this.configuration.auth0_redirectUrl = `${url}/callback`;

    switch (url) {
      case 'http://localhost:4200':
        break;
      case 'http://localhost:4000':
        this.configuration = {
          ...this.configuration,
          ...EnvApiLocalhostConfiguration,
        };
        break;
      case 'http://localhost:3200':
        this.configuration = {
          ...this.configuration,
          ...TenantReliableConfiguration,
        };
        break;
      case 'http://localhost:3000':
        this.configuration = {
          ...this.configuration,
          ...TenantReliableConfiguration,
          ...EnvApiLocalhostConfiguration,
        };
        break;
      case 'https://lt-ecomm-multi-tenant.azurewebsites.net':
        this.configuration = {
          ...this.configuration,
          ...EnvAzureProdConfiguration,
        };
        break;
      case 'https://lt-ecomm-multi-tenant-reliable.azurewebsites.net':
        this.configuration = {
          ...this.configuration,
          ...TenantReliableConfiguration,
          ...EnvAzureProdConfiguration,
        };
        break;
      case 'https://lt-ecomm-multi-tenant-lt-dev.azurewebsites.net':
        this.configuration = {
          ...this.configuration,
          ...EnvAzureDevConfiguration,
        };
        break;
      case 'https://lt-ecomm-multi-tenant-reliable-dev.azurewebsites.net':
        this.configuration = {
          ...this.configuration,
          ...TenantReliableConfiguration,
          ...EnvAzureDevConfiguration,
        };
        break;

      default:
        break;
    }
    // set the theme
    if (this.configuration.theme !== 'lubetech') {
      document.querySelector('body').classList.add(this.configuration.theme);
    }

    // set production mode
    if (this.configuration.production) {
      enableProdMode;
    }

    // set holiday message
    this.configuration.holidayMessage = this.getHoliday();
  }

  private getHoliday() {
    const holidaysToday = holidays.filter(
      (item) =>
        new Date(item.start) <= new Date(Date.now()) &&
        new Date(item.end) >= new Date(Date.now())
    );
    const holidayString = holidaysToday.map((item) => item.description).join(' ');
    return holidayString;
  }

  private getUrl() {
    const loc: any = this.platformLocation;
    // eslint-disable-next-line no-underscore-dangle
    const url = loc._location.origin;
    return url;
  }
}
