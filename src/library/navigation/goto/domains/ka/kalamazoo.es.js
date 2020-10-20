module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kalamazoo.es',
    timeout: 50000,
    zipcode: '',
    store: 'kalamazoo',
    country: 'ES',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout });
        console.log(`Selector loaded -> ${sel}`);
        return true;
      } catch (err) {
        console.log(`Selector did not load -> ${sel}`);
        return false;
      }
    };

    const cookieButton = await optionalWait('#onetrust-accept-btn-handler');

    if (cookieButton) {
      console.log('Accepting cookies dialouge.');
      await context.click('#onetrust-accept-btn-handler');
    }

    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
