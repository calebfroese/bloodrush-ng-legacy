import { BloodrushNg2Page } from './app.po';

describe('bloodrush-ng2 App', function() {
  let page: BloodrushNg2Page;

  beforeEach(() => {
    page = new BloodrushNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
