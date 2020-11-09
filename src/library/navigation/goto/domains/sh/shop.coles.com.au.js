
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
    // -------------Search--------------------------
    // const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]`;
    // await context.goto(url, {
    //   firstRequestTimeout: 60000,
    //   timeout: timeout,
    //   waitUntil: 'load',
    //   checkBlocked: false,
    // });
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // if (zipcode) {
    //   await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    // }
    // ----------------Core-----------
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
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
    console.log('Link:::', link);
    await context.goto('https://shop.coles.com.au' + link, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
