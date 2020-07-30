
module.exports = {

  implements: 'navigation/goto',

  parameterValues: {
    domain: 'grocery.walmart.com',
    country: 'US',
    store: 'walmartOG',
  },

  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]

    if (zipcode) {
      await dependencies.setZipCode({ zipcode: zipcode });
    }

    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: false });
  },
};
