const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.com.ar',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('div.home-product-cards div.product-card').length;
        while (count < 150) {
          const oldCount = count;
          document.querySelector('a.ver-mas-productos[style="display: block;"]') && document.querySelector('a.ver-mas-productos[style="display: block;"]').click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          count = document.querySelectorAll('div.home-product-cards div.product-card').length;

          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(resolve => setTimeout(resolve, 2000));

          if (oldCount === count) {
            break;
          }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
