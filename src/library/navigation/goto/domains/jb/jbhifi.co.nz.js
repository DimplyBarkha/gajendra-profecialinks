
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jbhifi.co.nz',
    timeout: 80000,
    country: 'NZ',
    store: 'jbhifi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setAntiFingerprint(false);
    // await context.setLoadAllResources(true);
    // await context.setBlockAds(false);
    // // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // console.log(zipcode);
    // if (zipcode) {
    //   await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    // }
    
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
