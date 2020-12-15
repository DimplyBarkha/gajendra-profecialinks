
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
    const userAgent = 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
    await context.setUserAgent(userAgent);
    await context.setBlockAds(false);
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
    async function autoScroll(page){
      await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(() => {
                  var scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
  
                  if(totalHeight >= scrollHeight){
                      clearInterval(timer);
                      resolve();
                  }
              }, 100);
          });
      });
    }
    await autoScroll(context);
    /* const notAvailable = await context.evaluate((xp) => !!document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), '//h2[contains(.,"Product Information is unavailable at this time.")]');
    if (notAvailable) {
      await dependencies.setZipCode({ url, zipcode });
      if (await context.evaluate((xp) => !!document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), '//h2[contains(.,"Product Information is unavailable at this time.")]')) {
        throw new Error('Product Unavailable page.');
      }
    } */
    await new Promise((r) => setTimeout(r, 2000));

    const blankPage = await context.evaluate(() => !document.querySelector('#content').innerHTML.length);
    if (blankPage) {
      throw new Error('Blank product page.');
    }
  },
};
