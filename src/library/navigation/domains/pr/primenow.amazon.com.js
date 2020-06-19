module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primenow.amazon.com',
    timeout: null,
    country: 'US',
    store: 'amazonPrimeNow',
  },
  // For navigating from home page to search page because we have to enter the zip code in  home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    const zip = await context.primeZipCode.apply(context) || '75204';

    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input#lsPostalCode');
    await context.setInputValue('input#lsPostalCode', zip);
    await context.click('input.a-button-input');
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
