
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'neonet.pl',
    timeout: 30000,
    country: 'PL',
    store: 'neonet',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    if (await context.evaluate(() => !!document.querySelector('[class="snrs-modal-btn-close"]'))) {
      await context.click('[class="snrs-modal-btn-close"]');
    }
  },
};
