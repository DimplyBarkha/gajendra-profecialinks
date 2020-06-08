
module.exports = {

  implements: 'navigation/goto',

  parameterValues: {
    domain: 'grocery.walmart.com',
    country: 'US',
    store: 'walmartOG',
  },

  implementation: async (inputs, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    const url = `${inputs.url}#[!opt!]{"anti_fingerprint":false}[/!opt!]`;
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  },
};
