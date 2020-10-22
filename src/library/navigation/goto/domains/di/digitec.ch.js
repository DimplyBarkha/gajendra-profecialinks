
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'digitec.ch',
    timeout: 60000,
    country: 'CH',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 10000;
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // url = `${url}#[!opt!]{"first_request_timeout":60,"load_timeout":60, "proxy":{"use_relay_proxy":false},"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]`;
    url = `${url}#[!opt!]{"user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}[/!opt!]`;
    await context.goto(url, {
      js_enabled: true,
      css_enabled: true,
      load_timeout: 60,
      load_all_resources: true,
      // timeout: timeout,
      // waitUntil: 'load',
      // checkBlocked: true,
    });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
