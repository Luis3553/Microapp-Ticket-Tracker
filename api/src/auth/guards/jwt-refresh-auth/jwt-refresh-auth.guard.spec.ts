import { RefreshAuthGuard } from './jwt-refresh-auth.guard';

describe('RefreshAuthGuard', () => {
  it('should be defined', () => {
    expect(new RefreshAuthGuard()).toBeDefined();
  });
});
