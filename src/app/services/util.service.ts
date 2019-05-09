import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {}

  cloneObj(obj: any) {
    return cloneDeep(obj);
  }
}
