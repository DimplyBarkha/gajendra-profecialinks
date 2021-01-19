const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    transform,
    domain: 'zdravcity.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('ul.js-search-list li.product-item').length;

        console.log('count total', count);
        console.log('before while');
        while (count < 150) {
          const oldCount = count;
          console.log('after scrooll');
          const scrollElement = document.querySelector('ul.js-search-list li.product-item:last-child');

          if (scrollElement) {
            console.log('crooll');
            scrollElement.scrollIntoView({ behaviour: 'smooth', block: 'end' });
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
          count = document.querySelectorAll('ul.js-search-list li.product-item').length;
          console.log('count total', count);
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
