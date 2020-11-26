module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    transform: null,
    domain: 'nay.sk',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('#lb-results > div > div > ul > li > div > div');
    async function firstItemLink () {
      return await context.evaluate(function () {
        const firstItem = document.querySelector('#lb-results > div > div > ul > li > div > div > a').href;
        return firstItem;
      });
    }
    const url = await firstItemLink();
    if (url !== null) {
      await context.goto(url, { timeout: 700000, waitUntil: 'load', checkBlocked: true });
    }
    return await context.extract(productDetails);
  // await context.extract(productDetails);
  },
}; // Updated code
