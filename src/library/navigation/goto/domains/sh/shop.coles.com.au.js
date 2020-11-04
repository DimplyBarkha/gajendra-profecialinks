
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.coles.com.au',
    timeout: 60000,
    country: 'AU',
    store: 'colesonline',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    console.log('URl:: ', url);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);

    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const link = await context.evaluate(() => {
      const link = document.querySelector("section[id*='product-list'] a[class*='product-image-link']") ? document.querySelector("section[id*='product-list'] a[class*='product-image-link']").getAttribute('href') : '';
      return link;
    });
    await context.goto('https://shop.coles.com.au' + link, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
