
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'booker.co.uk',
    timeout: 50000,
    store: 'booker',
    country: 'UK',
    zipcode: '',
  },
  // For navigating from home page to search page because search page is redirecting to home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    const LogoutBtn = await context.evaluate(async () => {
      return document.querySelector('a.logout-btn');
    });
    if (!LogoutBtn) {
      await context.waitForSelector('input#CustomerNumber');
      await context.setInputValue('input#CustomerNumber', '703636209');
      await context.click('input#CustomerNumber+button');
      await context.waitForSelector('form[action="/login"]');
      await context.setInputValue('input#Email', 'russell.kirkham@unilever.com');
      await context.setInputValue('input#Password', 'george');
      await context.click('button.login-btn');
      await context.waitForSelector('div#navbarMenuItems');
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
  },
};
