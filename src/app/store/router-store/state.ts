import { Params } from '@angular/router';


export interface RouterState {
  url: string;
  queryParams: Params;
  params: Params;
}
