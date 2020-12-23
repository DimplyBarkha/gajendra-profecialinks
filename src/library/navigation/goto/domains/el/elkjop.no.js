
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elkjop.no',
    timeout: 20000,
    country: 'NO',
    store: 'elkjop',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    try {
      await context.waitForSelector('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button not present');
    }
    try {
      await context.click('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button click failed!');
    }
  },
};
