
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sephora.ca',
    timeout: 10000,
    country: 'CA',
    store: 'sephora',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    // #[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setBypassCSP(false);
    await context.setUseRelayProxy(false);
    await context.setLoadAllResources(true);
    try {
      await context.goto("sephora.com");
      await context.click("span[data-at='country_ca']")
      await context.clickAndWaitForNavigation("[data-at='modal_dialog_continue_btn']")
    }
    catch(error){
      console.log(error)
    }
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true, enable_cache: false, cookies: [] });

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
