
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'allegro.pl',
    timeout: 20000,
    country: 'PL',
    store: 'allegro',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(() => {
      const dialogBox = document.querySelector('div[data-preference-name="eroticContentAllowed"]');
      if (dialogBox) {
        // @ts-ignore
        dialogBox.querySelector('button[data-role="accept"]').click();
      }
    });
  },
};
