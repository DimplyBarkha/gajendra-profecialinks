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
    const variants = await context.evaluate(async (selector) => {
      const variants = document.querySelectorAll(selector);
      const varIds = [];
      if (variants && variants.length) {
        variants.forEach(elem => {
          elem.click();
          const varId = document.querySelector('div.fa--variant-id').getAttribute('data-id');
          varIds.push(varId);
        });
      }
      const length = variants ? variants.length : 0;
      return { length, varIds };
    }, selector);

    console.log('variants', variants);

    if (variants.length > 1) {
      for (let index = 0; index < variants.length; index++) {
        if (index >= 0) {
          await context.evaluate((selector, index, varIds) => {
            function addHiddenDiv (id, content) {
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.innerHTML = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
            // add hidden div
            const variantString = varIds.join(' | ');
            addHiddenDiv('custom-variants', variantString);
            addHiddenDiv('custom-variants-count', varIds.length);
            const variants = document.querySelectorAll(selector);
            variants[index].click();
          }, selector, index, variants.varIds);
        }
        if (index !== variants.length - 1) {
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      };
    }
    return await context.extract(productDetails, { transform });
  },
};
