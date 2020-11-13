const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    transform: transform,
    domain: 'pccomponentes.com',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    //goto to the product page.
    const prodUrlLink = await context.evaluate(async function() {
      const urlSelector = 'div[class*=product-card__content] h3 a';
      const prodNode = document.querySelector(urlSelector);
      if(prodNode && prodNode.hasAttribute('href')) {
        return `https://www.pccomponentes.com${prodNode.getAttribute('href')}`;
      } else {
        console.log("NO PRODUCT FOUND");
        return "";
      }
    });
    if(prodUrlLink) {
      await context.goto(prodUrlLink, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    } else {
      throw Error("Product URL not found - check URL selector");
    }
    return await context.extract(productDetails, { transform: transformParam });
  }
};
