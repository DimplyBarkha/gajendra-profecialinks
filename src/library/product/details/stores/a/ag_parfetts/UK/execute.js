
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ag_parfetts',
    domain: 'online.parfetts.co.uk',
    loadedSelector: null,
    noResultsXPath: '//div[@class="main-column"]//h2[@class="font-weight-bold"]',
    zipcode: '',
  },
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   // await context.waitForSelector('.infinite-scroll-pagination div[class*="product-card"] a');
  //   await context.evaluate(async function () {
  //     const seeAllSelector = document.querySelector('.infinite-scroll-pagination div[class*="product-card"] a');
  //     if (seeAllSelector) {
  //       seeAllSelector.click();
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // }
};
