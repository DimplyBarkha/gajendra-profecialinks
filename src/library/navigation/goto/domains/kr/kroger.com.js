
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kroger.com',
    country: 'US',
    store: 'kroger',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    const optUrl = `${url}#[!opt!]{"anti_fingerprint":false, "first_request_timeout": 60, "proxy":{"use_relay_proxy": false}}[/!opt!]`;
    await context.goto(optUrl, { timeout: 45000, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: optUrl, zipcode });
    }
  },
};
