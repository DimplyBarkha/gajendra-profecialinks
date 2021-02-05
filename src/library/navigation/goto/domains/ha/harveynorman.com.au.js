
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'harveynorman.com.au',
    timeout: 900000,
    country: 'AU',
    store: 'harveynorman',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setBlockAds(false);
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // console.log("neha"+zipcode);
    // if (zipcode) {
    //   await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    // }
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode } = inputs;
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    // await context.setLoadImages(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode(inputs);
    }
  },
};
