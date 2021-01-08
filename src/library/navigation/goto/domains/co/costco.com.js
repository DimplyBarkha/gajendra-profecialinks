
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    country: 'US',
    timeout: 100000,
    store: 'costco',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 80000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);

    // const URL = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true, "cookie_jar"}[/!opt!]`;

    // await context.goto(URL, { timeout: timeout, waitUntil: 'load', checkBlocked: true });

    await context.goto(url, { first_request_timeout: 90000, timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
  // implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
  //   if (zipcode) {
  //     url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true, "cookie_jar":[{"name":"invCheckPostalCode","value":${zipcode}}]}[/!opt!]`;
  //   } else {
  //     url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true}[/!opt!]`;
  //   }
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 80000,
  //     waitUntil: 'load',
  //   });
  //   await context.waitForNavigation();
  // },
};
