import { SapperModule } from './sapper.module';

describe('SapperModule', () => {
  let sapperModule: SapperModule;

  beforeEach(() => {
    sapperModule = new SapperModule();
  });

  it('should create an instance', () => {
    expect(sapperModule).toBeTruthy();
  });
});
