
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'aptekagemini.pl',
    timeout: 50000,
    country: 'PL',
    store: 'aptekagemini',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('div[class="vue-modal__content"]');
      await context.click('button[class*="button vue-privacy"]');
    } catch (e) {
      console.log('No cookie box');
    }
  },
};
