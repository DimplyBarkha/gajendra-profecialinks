const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    transform,
    domain: 'falabella.com.ar',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const selector = 'section.pdp-detail-section div.color-swatch-container ul.swatch--container button.colorSwatch-medium';
    const variantsLength = await context.evaluate(async (selector) => {
      const variants = document.querySelectorAll(selector);
      return variants ? variants.length : 0;
    }, selector);

    // console.log('variantsLength', variantsLength);

    if (variantsLength > 1) {
      for (let index = 0; index < variantsLength; index++) {
        if (index > 0) {
          await context.evaluate((selector, index) => {
            const variants = document.querySelectorAll(selector);
            variants[index].click();
          }, selector, index);
        }
        if (index !== variantsLength - 1) {
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      };
    }
    return await context.extract(productDetails, { transform });
  },
};
