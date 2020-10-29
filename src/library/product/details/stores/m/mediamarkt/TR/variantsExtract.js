/* eslint-disable no-inner-declarations */
// @ts-nocheck
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.com.tr',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;

    await context.evaluate(() => {
      const selectors = {
        isVariants: 'div[class*="product-attributes"]',
        isColors: '.product-attributes__color-item',
        isSizes: '.product-attributes__item-select',
      };
      const body = document.querySelector('body');
      const isVariants = document.querySelector(selectors.isVariants);
      function createElement (el, text) {
        const ele = document.createElement(el);
        ele.className = 'variants';
        ele.innerText = text;
        body.append(ele);
      }
      if (isVariants) {
        let variants = [];
        const isColors = document.querySelector(selectors.isColors);
        const isSizes = document.querySelector(selectors.isSizes);
        function getVariants (selector) {
          return [...document.querySelectorAll(selector)];
        }
        if (isColors) {
          variants = getVariants(selectors.isColors);
        }
        if (!isColors && isSizes) {
          variants = getVariants(selectors.isSizes + ' option');
        }
        if (isColors && isSizes) {
          const sizes = getVariants(selectors.isSizes + ' option');
          sizes.forEach(size => {
            variants.push(size);
          });
        }
        let variants2 = [];
        for (let i = 0; i < variants.length; i++) {
          variants2.push(variants[i].getAttribute('data-action-id'));
        }
        variants2 = [...new Set(variants2)];
        for (let i = 0; i < variants2.length; i++) {
          const text = 'https://www.mediamarkt.com.tr' + variants2[i];
          createElement('div', text);
        }
      } else {
        const url = document.querySelector('meta[property="og:url"]').getAttribute('content');
        createElement('div', url);
      }
    });
    return await context.extract(variants, { transform });
  },
};
