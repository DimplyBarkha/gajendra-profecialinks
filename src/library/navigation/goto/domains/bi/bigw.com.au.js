
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bigw.com.au',
    timeout: 100000,
    country: 'AU',
    store: 'bigw',
    zipcode: "''",
    wait: 'networkidle0',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    await context.setBlockAds(true);
    const url = `${inputs.url}#[!opt!]{"anti_fingerprint":false}[/!opt!]`;
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  },
};
