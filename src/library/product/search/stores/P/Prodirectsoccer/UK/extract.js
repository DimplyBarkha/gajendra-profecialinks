const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'Prodirectsoccer',
    transform,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.waitForNavigation();
    await context.evaluate(async () => {
      const products = document.querySelectorAll('.lister-grid__content>div>.product-thumb');
      products.forEach((product, index) => {
        // rating
        let ratingValue = 0;
        const stars = product.querySelectorAll('div.rating__stars div');
        if (stars.length > 0) {
          stars.forEach(star => {
            let starValue = 0;
            if (star.getAttribute('style').slice(-5, -2)) {
              starValue = Number(star.getAttribute('style').slice(-5, -2)) / 20;
              ratingValue += starValue;
            } else {
              starValue = Number(star.getAttribute('style').slice(-4, -2)) / 20;
              ratingValue += starValue;
            }
          });
          const ratingAttribute = ratingValue.toFixed(1);
          product.setAttribute('rating', ratingAttribute);
        }
      });
    });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 200;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
