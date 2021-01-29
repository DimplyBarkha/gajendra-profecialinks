
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'pistorone.ch',
    prefix: null,
    url: null,
    country: 'CH',
    store: 'pistor',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const mainUrl = `https://www.pistorone.ch/search?add_article=${inputs.id}`;
    await context.goto(mainUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('div#basket');

    const productUrl = await context.evaluate(async function () {
      const productDetails = document.querySelector('a[rel="details"]');
      const productDetailsUrl = productDetails ? 'https://www.pistorone.ch' + productDetails.getAttribute('href') : window.location.href;
      return productDetailsUrl;
    });
    return productUrl;
  },
};
