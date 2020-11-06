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

    const selectors = {
      isVariants: 'div[class*="product-attributes"]',
      isColors: '.product-attributes__color-item',
      isSizes: '.product-attributes__item-select',
      notVariants: 'meta[property="og:url"]',
    };
    try {
      try {
        await context.waitForSelector(selectors.isVariants);
        await context.evaluate((selectors) => {
          const body = document.querySelector('body');
          function createElement (el, text, clsName) {
            const ele = document.createElement(el);
            ele.className = clsName;
            ele.innerText = text;
            body.append(ele);
          }
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
          const fromMeta = document.querySelector(selectors.notVariants).getAttribute('content');
          variants2.push(fromMeta);
          variants2 = [...new Set(variants2)];
          for (let i = 0; i < variants2.length; i++) {
            const res1 = variants2[i].search('https://www.mediamarkt.com.tr');
            const res2 = variants2[i].search('/es/product');
            const res3 = variants2[i].search('https://www.mediamarkt.es');
            const res4 = variants2[i].search('/tr/product');
            if (res2 !== -1) {
              if (res3 === -1) {
                variants2[i] = 'https://www.mediamarkt.es' + variants2[i];
              }
            }
            if (res4 !== -1) {
              if (res1 === -1) {
                variants2[i] = 'https://www.mediamarkt.com.tr' + variants2[i];
              }
            }
          }
          variants2 = [...new Set(variants2)];
          for (let i = 0; i < variants2.length; i++) {
            createElement('div', variants2[i], 'variants-url');
          }
          for (let i = 0; i < variants2.length; i++) {
            variants2[i] = variants2[i].replace(/(.+-)(\d+)(.+)/, '$2');
            createElement('div', variants2[i], 'variants-id');
          }
        }, selectors);
      } catch (e) {
        await context.evaluate((selectors) => {
          function createElement (el, text, clsName) {
            const ele = document.createElement(el);
            ele.className = clsName;
            ele.innerText = text;
            body.append(ele);
          }
          const body = document.querySelector('body');
          const url = document.querySelector(selectors.notVariants).getAttribute('content');
          createElement('div', url, 'variants-url');
          const id = url.replace(/(.+-)(\d+)(.+)/, '$2');
          createElement('div', id, 'variants-id');
        }, selectors);
      }
    } catch (e) {
      console.log('No such product present');
    }
    return await context.extract(variants, { transform });
  },
};
