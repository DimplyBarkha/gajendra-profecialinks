module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'nordstrom.com',
    country: 'US',
    store: 'nordstrom',
    timeout: '100000',
  },
  //   implementation: async (
  //   { url, zipcode, storeId },
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   const timeout = parameters.timeout ? parameters.timeout : 10000;
  //   await context.setBlockAds(false);
  //   await context.setLoadAllResources(true);
  //   await context.setLoadImages(true);
  //   await context.setAntiFingerprint(false);
  //   try {
  //     await context.goto(url, {
  //       timeout: timeout,
  //       waitUntil: 'networkidle0',
  //       checkBlocked: true,
  //     });
  //   } catch (e) {
  //     console.log('page load time out ----> ', e);
  //   }
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
  //   }
  // },
};
