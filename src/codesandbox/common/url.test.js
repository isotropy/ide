import { getSandboxOptions } from './url';

function testSandboxOptions(url: string) {
  expect(getSandboxOptions(url)).toMatchSnapshot();
}

describe('url parameters', () => {
  it('keeps everything false on normal urls', () => {
    testSandboxOptions('https://edit.looptype.com/s/new');
  });

  it('sets current module if there is one', () => {
    testSandboxOptions('https://edit.looptype.com/s/new?module=test');
  });

  it('sets preview view', () => {
    testSandboxOptions('https://edit.looptype.com/s/new?view=preview');
  });

  it('sets editor view', () => {
    testSandboxOptions('https://edit.looptype.com/s/new?view=editor');
  });

  it("doesn't set unknown fields", () => {
    testSandboxOptions('https://edit.looptype.com/s/new?view=both');
  });

  it('can hide navigation', () => {
    testSandboxOptions('https://edit.looptype.com/s/new?hidenavigation=1');
  });

  it('can autoresize', () => {
    testSandboxOptions('https://edit.looptype.com/s/new?autoresize=1');
  });

  it('can handle multiple options', () => {
    testSandboxOptions(
      'https://edit.looptype.com/s/new?autoresize=1&view=editor&module=test&hidenavigation=1'
    );
  });
});
