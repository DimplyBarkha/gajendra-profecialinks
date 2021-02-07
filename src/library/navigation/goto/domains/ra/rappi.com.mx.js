
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'rappi.com.mx',
    timeout: 120000,
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
    await context.setFirstRequestTimeout(100000);
    let resp = await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    if(resp.status.toString() === "503") {
      throw new Error('got 503 as result - throwing error!!');
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
