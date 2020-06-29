
module.exports = {
  parameterValues: {
    country: 'US',
    domain: 'primenow.amazon.com',
    store: 'amazonPrimeNow_75204',
    zipcode: '75204',
  },
  // For navigating from home page to search page because we have to enter the zip code in  home page.
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input#lsPostalCode');
    await context.setInputValue('input#lsPostalCode', zipcode);
    await context.click('input.a-button-input');
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
