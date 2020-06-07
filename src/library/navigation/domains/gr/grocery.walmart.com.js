
module.exports = {

  implements: 'navigation/goto',

  parameterValues: {
    domain: 'grocery.walmart.com',
    country: 'US',
    store: 'walmartOG',
  },

  implementation: async (inputs, parameterValues, context, dependencies) => {
    // CSS
    const cssProductPrice = 'div[data-automation-id="productPageTile"] div[class*="titleContainer"] [data-automation-id="salePrice"]';
    const cssProductMainImage = 'div[data-automation-id="productPageTile"] div[class*="imageContainer"] img[data-automation-id="image"] , div[data-automation-id="productPageTile"] div[class*="imageContainer"] img[data-tl-id="ProductPage-primary-image"]';

    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    const url = `${inputs.url}#[!opt!]{"anti_fingerprint":false}[/!opt!]`;
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    // await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true , captureRequests: true});
    try {
      await context.waitForSelector(cssProductPrice, { timeout: 10000 });
      await context.waitForSelector(cssProductMainImage, { timeout: 10000 });
    } catch (e) {
      console.log('Handling Wait Timeout - Optional');
      console.log(e);
    }
  },
};
