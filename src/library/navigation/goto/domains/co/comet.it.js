module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'comet.it',
    timeout: 50000,
    country: 'IT',
    store: 'comet',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
