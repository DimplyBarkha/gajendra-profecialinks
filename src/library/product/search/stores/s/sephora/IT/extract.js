const { transform } = require('../IT/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'sephora',
    transform,
    domain: 'sephora.it',
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
  await context.evaluate(async function () {
    let count = document.querySelectorAll('ul#search-result-items > li').length;
    const scrollElement = document.querySelector('div.infinite-scroll-placeholder');
    while (scrollElement && count <= 150) {
      scrollElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      await new Promise(resolve => setTimeout(resolve, 5500));
      const newCount = document.querySelectorAll('ul#search-result-items > li').length;
      if (newCount === count) {
        break;
      } else {
        count = newCount;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
