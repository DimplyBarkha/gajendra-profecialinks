
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'rappi.com.mx',
    timeout: 60000,
    country: 'MX',
    // store: 'rappi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
