
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.es',
    timeout: 35000,
    country: 'ES',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads":true,"anti_fingerprint":false,"first_request_timeout":60000,"force200":true,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]`;
    // `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": true}[/!opt!]`
    // await context.goto(url, {
    //   block_ads: false,
    //   load_all_resources: true,
    //   images_enabled: true,
    //   timeout: 35000,
    //   waitUntil: 'load',
    // });
    await context.goto(url, {
      timeout: 35000,
      waitUntil: 'load',
    });
    // await context.setBlockAds(false);
    // await context.goto(`${url}`, {
    //   anti_fingerprint: true,
    //   block_ads: false,
    //   discard_CSP_header: false,
    //   timeout: 350000,
    //   waitUntil: 'load',
    //   load_all_resources: true,
    // });
  },
};
