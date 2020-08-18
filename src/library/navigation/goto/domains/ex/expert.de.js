
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
    // await context.setBlockAds(false);
    // await context.goto(`${url}`, {
    //   anti_fingerprint: true,
    //   discard_CSP_header: true,
    //   timeout: 100000,
    //   waitUntil: 'load',
    // });
    // await context.setBlockAds(false);
    // await context.goto(`${url}#[!opt!]{"anti_fingerprint":true, "discard_CSP_header":false}[/!opt!]`, {
    //       images_enabled: true,
    //       timeout: 100000,
    //       waitUntil: 'load',
    // })
    await context.setBlockAds(false);
    await context.goto(`${url}`, {
      anti_fingerprint:true, 
      discard_CSP_header:false,
      timeout: 100000,
      waitUntil: 'load',
    });
  },

};
