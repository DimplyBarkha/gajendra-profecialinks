const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        if (document.querySelector('div.cookie button[name="accept_cookie"]')) {
          // @ts-ignore
          await document.querySelector('div.cookie button[name="accept_cookie"]').click();
        }
        window.scroll(0, scrollTop);
        await stall(500);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });

    await context.evaluate(() => {
      // @ts-ignore
      const allProducts = document.querySelectorAll('div[class*=product-grid__card] > div[class*=product-card]');
      allProducts.forEach((product, index) => {
        const rating = product.querySelector('meter') ? product.querySelector('meter').getAttribute('value').replace('.', ',') : null;
        const endorsement = product.querySelector('div[class*=product-card__badge]')
          ? product.querySelector('div[class*=product-card__badge]').textContent.replace('\n', ' ') : null;
        const manufacturer = product.querySelector('img[class=product-card__brand-logo]')
          ? product.querySelector('img[class=product-card__brand-logo]').getAttribute('alt') : null;
        if (rating) product.setAttribute('product-rating', rating);
        if (endorsement) product.setAttribute('product-endorsement', endorsement);
        if (manufacturer) product.setAttribute('product-manufacturer', manufacturer);
      });
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
