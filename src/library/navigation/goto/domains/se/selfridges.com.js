module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'selfridges.com',
    timeout: 60000,
    country: 'UK',
    store: 'selfridges',
    zipcode: '',
  },

  implementation: async ({ url },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const maxRetries = 3;
    const numberOfCaptchas = 0;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    await context.goto(`${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'networkidle0',
      checkBlocked: true,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
    });
  },
};
