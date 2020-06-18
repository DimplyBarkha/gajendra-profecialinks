
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primenow.amazon.com',
    timeout: null,
    country: 'US',
    store: 'amazonPrimeNow_75204',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input#lsPostalCode');
    await context.setInputValue('input#lsPostalCode', '75204');
    await context.click('input.a-button-input');
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
