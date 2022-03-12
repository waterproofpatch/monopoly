import { Injectable } from '@angular/core';
import { BaseComponent } from './base/base/base.component';
import { environment } from '../environments/environment'; // Change this to your file location

@Injectable({
  providedIn: 'root',
})
export class BaseService extends BaseComponent {
  constructor() {
    super();
  }
  getUrlBase(): string {
    return environment.apiUrlBase;
  }
}
