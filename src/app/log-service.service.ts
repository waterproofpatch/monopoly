import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor() {}
  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }
}
