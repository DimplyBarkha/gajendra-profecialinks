
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    transform: transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    const pId = inputs.id;
    console.log(inputs.id + ' is product id in extract.js');
    const searchUrl = `https://uae.sharafdg.com/?q=${pId}&post_type=product`;
    await context.goto(searchUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
    const productUrl = await context.evaluate(async function () {
      let productUrl = null;
      if (document.querySelector('div[class="product-container"] div[class*="carousel-details"]')) {
        productUrl = document.querySelector('div[class="product-container"] div[class*="carousel-details"] a').getAttribute('href');
      }
      return productUrl;
    });
    if (productUrl !== null) {
      await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
    }
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    });
    return await context.extract(productDetails, { transform });
  },
};
