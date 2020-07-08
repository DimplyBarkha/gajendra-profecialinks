
// module.exports = {
//   implements: 'navigation/goto',
//   parameterValues: {
//     domain: 'walmart.com/grocery',
//     timeout: null,
//     country: 'US',
//     store: 'walmartOG',
//     zipcode: '72758',
//   },
// };

module.exports = {

  implements: 'navigation/goto',

  parameterValues: {
    domain: 'walmart.com/grocery',
    country: 'US',
    store: 'walmartOG',
  },

  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]

    if (zipcode) {
      await dependencies.setZipCode({ zipcode: zipcode });
    }

    const inputUrl = `${url}#[!opt!]{"anti_fingerprint":false}[/!opt!]`;
    await context.goto(inputUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  },
};
