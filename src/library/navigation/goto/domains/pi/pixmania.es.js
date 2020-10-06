
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'pixmania.es',
    timeout: 60000,
    country: 'ES',
    store: 'pixmania',
  },
  // implementation: async (
  //   { url, zipcode, storeId },
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":false}[/!opt!]`;
  //   const timeout = parameters.timeout ? parameters.timeout : 60000;
  //   // await context.setJavaScriptEnabled(true);
  //   // await context.setCssEnabled(true);
  //   // await context.setLoadAllResources(true);
  //   // await context.setLoadImages(true);
  //   // await context.setBlockAds(false);
  //   // await context.setAntiFingerprint(false);

  //   await context.goto(url, {
  //     // firstRequestTimeout: 60000,
  //     timeout: timeout,
  //     waitUntil: 'load',
  //     // checkBlocked: false,
  //     // cssEnabled: true,
  //     // discardCSPHeader: true,
  //     // embedIframes: true,
  //     // imagesEnabled: true,
  //     // loadAllResources: true,
  //     // force200: true,
  //     // blockAds: false,
  //     // jsEnabled: true,
  //     // gotoTimeout: 1000,
  //     // randomMoveMouse: false,
  //   });
  //   await context.waitForNavigation({ timeout: 30000 });
  // },
};
