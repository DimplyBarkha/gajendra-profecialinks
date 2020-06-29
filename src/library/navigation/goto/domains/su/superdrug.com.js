
module.exports = {
  parameterValues: {
    domain: 'superdrug.com',
    country: 'UK',
    store: 'superdrug',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
    const productPage = await context.evaluate(function () {
      return Boolean(document.querySelector('body[data-page-id="productDetails"]'));
    });

    if (productPage) {
      await context.waitForSelector('span[itemprop="reviewCount"]');
    }
  },
};
