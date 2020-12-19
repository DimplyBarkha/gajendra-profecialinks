const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    let scrolltop = document.getElementById('main').scrollTop;

    while (document.querySelector('div.btn-view-more-products > button')) {
      document.querySelector('div.btn-view-more-products > button').click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    store: 'migros',
    transform: transform,
    domain: 'migros.ch',
    zipcode: '',
  },
  implementation,
};


