import { RouterStateSerializer } from '@ngrx/router-store';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterState } from '@store/router-store/state';


export class CustomSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}


export const RouterSerializerProvider = {
  provide: RouterStateSerializer,
  useClass: CustomSerializer,
};
