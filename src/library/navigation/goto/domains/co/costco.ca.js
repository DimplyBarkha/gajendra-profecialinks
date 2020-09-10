
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.ca',
    timeout: 20000,
    country: 'CA',
    store: 'costco',
    zipcode: 'M5V 2A5',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });

    try {
      await context.waitForSelector('input[id="language-region-set"]', { timeout });
      await context.click('input[id="language-region-set"]');
      await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
    } catch (err) {
      console.log('Error while clicking on set language.');
    }

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
