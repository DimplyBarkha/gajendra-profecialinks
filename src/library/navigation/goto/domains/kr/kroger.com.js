
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kroger.com',
    country: 'US',
    store: 'kroger',
    timeout: 120000,
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    const optUrl = `${url}#[!opt!]{"anti_fingerprint":false, "first_request_timeout": 60, "proxy":{"use_relay_proxy": false}}[/!opt!]`;
    await context.goto(optUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: optUrl, zipcode });
    }
  },
};
