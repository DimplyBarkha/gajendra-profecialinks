const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    transform,
    domain: 'martinplace.romeosonline.com.au',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.evaluate(async () => {
      const productsPerPage = 48;
      const pageElem = document.querySelector('em[aria-current="page"]');
      const pageNum = pageElem && pageElem.textContent ? parseInt(pageElem.textContent, 10) : 1;
      const products = document.querySelectorAll('div[class="TalkerGrid__Item"]');
      for (let i = 0; i < products.length; i++) {
        const rankOrganic = (pageNum - 1) * productsPerPage + (i + 1);
        products[i].setAttribute('rankOrganic', rankOrganic.toString());
      }
    });
    return await context.extract(productDetails);
  },
};
