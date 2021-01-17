
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'harveynorman.com.au',
    timeout: 500000,
    country: 'AU',
    store: 'harveynorman',
    zipcode: "''",
  },
  
  /* ----- commented because data is not coming for some urls eg- "https://www.harveynorman.com.au/miele-g-4263-scvi-active-60cm-fully-integrated-dishwasher.html"---- */

  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  //   const timeout = parameters.timeout ? parameters.timeout : 10000;
  //   await context.setBlockAds(false);
  //   await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  //   console.log(zipcode);
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
  //   }
  // },
};
