module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'nfm.com',
    timeout: null,
    country: 'US',
    store: 'nfm',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, first_request_timeout: 60, load_timeout:60 });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
