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

  getUpdatedData(data: object, newData: object): object {
    const result = {};
    const dataKeys = Object.keys(data);
    const newDataKeys = Object.keys(newData);

    dataKeys.forEach((key: string) => {
      if (data[key] !== newData[key]) {
        result[key] = newData[key];
      }
    });

    return result;
  }
}
