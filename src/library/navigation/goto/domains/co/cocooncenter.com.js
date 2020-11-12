
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cocooncenter.com',
    timeout: 1000000,
    country: 'FR',
    store: 'cocooncenter',
    zipcode: "''",
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
    ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    const responseStatus = await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    },
};
