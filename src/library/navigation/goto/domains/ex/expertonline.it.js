
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expertonline.it',
    timeout: 90000,
    country: 'IT',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // await context.setAntiFingerprint(false);
    // await context.setLoadAllResources(true);
    // await context.setBlockAds(false);
    // await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    // console.log(zipcode);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    const responseStatus = await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 250000,
      waitUntil: 'load',
      checkBlocked: true,
      embed_iframes: true,
    });
    console.log('response Status :', responseStatus.status);
    console.log('response URL :', responseStatus.url);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
