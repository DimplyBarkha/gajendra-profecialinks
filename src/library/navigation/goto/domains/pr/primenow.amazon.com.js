
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primenow.amazon.com',
    timeout: null,
    country: 'US',
    store: 'amazonPrimeNow75204',
  },
  // For navigating from home page to search page because we have to enter the zipcode in  home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input#lsPostalCode');
    await context.setInputValue('input#lsPostalCode', '75204');
    await context.click('input.a-button-input');
    await context.waitForSelector('input.page_header_search_wrapper__searchField__3__cr');
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
