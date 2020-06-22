
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    country: 'US',
    store: 'costco',
  },
  // For Setting up the location Zip code via cookie.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function () {
      const zipCode = '98188';
      const cookieString = `invCheckPostalCode=${zipCode}; expires=Sun, 1 Jan 2099 00:00:00 UTC; path=/`;
      document.cookie = cookieString;
    });
    await context.waitForSelector('div.thumbnail p.description');
    // For scrolling down to the bottom of page to ensure full loaded page.
    await context.evaluate(async function () {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
