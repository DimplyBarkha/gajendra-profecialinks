
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sephora.com',
    timeout: 30000,
    country: 'CA',
    store: 'sephora',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);

    // [!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      cookies: [{
        name: 'site_locale',
        value: 'ca',
        domain: 'www.sephora.com',
        path: '/',
        secure: false,
        httpOnly: false,
      }],
    });
    // await context.evaluate(function() {
    //   document.cookie = "site_locale=ca;"
    // });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
