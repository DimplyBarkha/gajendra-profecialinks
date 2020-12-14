
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kroger.com',
    country: 'US',
    store: 'kroger',
    timeout: 120000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'networkidle0', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
    // load details page
    const productPage = await context.evaluate(() => !!document.querySelector('div.ProductDetails'));
    if (productPage) {
      await context.waitForXPath("//li[@itemprop='review']", { timeout: 10000 })
        .catch(() => console.log('waited for reviews to load, none found '));
    }
    const notAvailable = await context.evaluate((xp) => !!document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), '//h2[contains(.,"Product Information is unavailable at this time.")]');
    if (notAvailable) {
      await dependencies.setZipCode({ url, zipcode });
      if (await context.evaluate((xp) => !!document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), '//h2[contains(.,"Product Information is unavailable at this time.")]')) {
        throw new Error('Product Unavailable page.');
      }
    }
    await new Promise((r) => setTimeout(r, 2000));

    const blankPage = await context.evaluate(() => !document.querySelector('#content').innerHTML.length);
    if (blankPage) {
      throw new Error('Blank product page.');
    }
  },
};
