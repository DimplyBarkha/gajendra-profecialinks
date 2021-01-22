const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'foodie',
    transform,
    domain: 'foodie.fi',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let count = document.querySelectorAll('ul.products-shelf > li.item').length;
      console.log('...', !!document.querySelector('a.js-load-more'));
      while (document.querySelector('#footer') && count <= 150) {
        document.querySelector('#footer').scrollIntoView({ behavior: 'smooth', block: 'end' });
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        const newCount = document.querySelectorAll('ul.products-shelf > li.item').length;
        if (newCount === count) {
          break;
        } else {
          count = newCount;
        }
      }
    });
  };
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}
