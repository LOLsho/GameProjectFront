import { RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '../../../app/store/router.serializer';


export const RouterSerializerProvider = {
  provide: RouterStateSerializer,
  useClass: CustomSerializer,
};
