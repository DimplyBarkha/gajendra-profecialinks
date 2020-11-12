
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.ca',
    timeout: 20000,
    country: 'CA',
    store: 'costco',
    zipcode: 'M5V 2A5',
  },
  implementation: async ({ url, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);

    const URL = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true, "cookie_jar":[{"name":"invCheckPostalCode","value":"${parameters.zipcode}"}]}[/!opt!]`

    await context.goto(URL, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });

    try {
      await context.waitForSelector('input[id="language-region-set"]', { timeout });
      await context.click('input[id="language-region-set"]');
      await context.goto(URL, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
    } catch (err) {
      console.log('Error while clicking on set language.');
    }

    console.log(parameters.zipcode);
    if (parameters.zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: parameters.zipcode, storeId });
    }
  },
};
