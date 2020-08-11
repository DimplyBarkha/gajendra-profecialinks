
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: null,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(() => {
      if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
        document.querySelector('.widget-Popup--container-outer---view-popup').click();
      }
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
