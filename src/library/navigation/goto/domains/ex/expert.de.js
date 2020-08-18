
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expert.de',
    timeout: 35000,
    country: 'DE',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    await context.setBlockAds(false);
    await context.goto(`${url}#[!opt!]{"anti_fingerprint":false, "mode":"no-cors", "setblockads":false, "force200": true}[/!opt!]`, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
    
  },

};
