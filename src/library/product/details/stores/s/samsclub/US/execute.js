
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });

    let productLink = await context.evaluate(function () {
      return document.querySelector("div.sc-plp-cards > div > ul > li > div > a").href;
    });

    if (productLink) {
      productLink = `${productLink}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
      context.setBlockAds(false);
      context.setLoadAllResources(true);
      context.setAntiFingerprint(false);
      await context.goto(productLink, {
        timeout: 50000,
        waitUntil: 'load',
        checkBlocked: true,
        block_ads: false,
        load_all_resources: true,
        images_enabled: true,
        css_enabled: true,
        embed_iframes: true,
      });
      await new Promise(resolve => setTimeout(resolve, 20000));
    }
  },
};
