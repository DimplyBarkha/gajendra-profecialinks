module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'breuninger.de',
    timeout: 60000,
    country: 'DE',
    store: 'breuninger',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false, "force200": true}[/!opt!]`;
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false, force200: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
