const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // scroll the page
    const productsAmount = parseInt(document.querySelector('div[class="product-list-actions"] span[class="item-count"]').textContent.match(/\d+/g)[1]);
    while (true) {
      window.scrollTo({ top: (document.body.scrollHeight), behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 500));
      const elements = document.querySelectorAll('li[class="with-quick-view-component generic"]').length;
      if (elements >= 150 || elements === productsAmount) {
        break;
      }
    }
  });
  await context.evaluate(async () => {
    // add rank attribute
    var rank = document.querySelectorAll('li[class="with-quick-view-component generic"]');

    rank.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tennents',
    transform: transform,
    domain: 'new.tennentsdirect.com',
    zipcode: '',
  },
  implementation,
};
