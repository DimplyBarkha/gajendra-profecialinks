
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'innovasport.com',
    timeout: null,
    country: 'MX',
    store: 'innovasport',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    let resp = await context.goto(url, { timeout: timeout });
    console.log('response status - ' + resp.status);
    if(resp.status === 403 || resp.status === 404) {
      throw new Error(`got status - ${resp.status} -- throwing error here`);
    }
    // {waitUntil: 'load', checkBlocked: true}
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
