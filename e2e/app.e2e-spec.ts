import { ScreenshotsPage } from './app.po';

describe('screenshots App', function() {
  let page: ScreenshotsPage;

  beforeEach(() => {
    page = new ScreenshotsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
