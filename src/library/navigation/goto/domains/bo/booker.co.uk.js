
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'booker.co.uk',
    timeout: null,
    store: 'booker',
    country: 'UK',
    zipcode: '',
  },
  // For navigating from home page to search page because search page is redirecting to home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    const LogoutBtn = await context.evaluate(async () => {
      return document.querySelector('a#SHC_ASC_HyperLink2');
    });
    const branchSelected = await context.evaluate(async () => {
      return document.querySelector('a#SHC_ASC_BrowseUserLink');
    });
    if (branchSelected) {
      await context.click('a#SHC_ASC_BrowseUserLink');
    };
    if (!LogoutBtn) {
      await context.waitForSelector('input[name="OutsideHomePageControl$CustomerNumber"]');
      await context.setInputValue('input[name="OutsideHomePageControl$CustomerNumber"]', '703636209');
      await context.click('input[name="OutsideHomePageControl$cmdCustomerNumber"]');
      await context.waitForSelector('input[name="LoginControl$EmailSingle"]');
      await context.setInputValue('input[name="LoginControl$EmailSingle"]', 'russell.kirkham@unilever.com');
      await context.setInputValue('input[name="LoginControl$PasswordSingle"]', 'george');
      await context.click('input[name="LoginControl$EnterEmailPasswordSubmit"]');
      await context.waitForSelector('ul[id="tabmenu"]');
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
  },
};