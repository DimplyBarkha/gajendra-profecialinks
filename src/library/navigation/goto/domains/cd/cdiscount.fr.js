
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cdiscount.fr',
    timeout: 50000,
    country: 'FR',
    store: 'cdiscount',
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    const optTagUrl = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(optTagUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
