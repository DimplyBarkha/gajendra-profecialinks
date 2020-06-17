
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primenow.amazon.com',
    timeout: null,
    country: 'US',
    store: 'amazonPrimeNow_98005',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.setInputValue('div.postalCodeColumn input#lsPostalCode', '98005');
    await context.click('span.a-button-inner input.a-button-input');
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('span#productTitle');
  },
};
