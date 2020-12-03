const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'piperitas',
    transform,
    domain: 'piperitas.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },

  ) => {
    await context.evaluate(async function () {
      const rating = document.querySelector('.fdt_productsealblackwhite_ratx');
      if (rating) {
        const ratingConverted = rating.firstChild.nodeValue.replace('.', ',');
        rating.setAttribute('rating', ratingConverted);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
