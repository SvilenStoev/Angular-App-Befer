import { CreatedBeforePipe } from './created-before.pipe';

describe('CreatedBeforePipe', () => {
  it('create an instance', () => {
    const pipe = new CreatedBeforePipe();
    expect(pipe).toBeTruthy();
  });
});
