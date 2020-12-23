const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // add rank attribute
    var rank = document.querySelectorAll('div[class="product-tile"], li[class="col-xs-6 col-sm-4 col-md-3 grid-product"]');

    rank.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    transform: transform,
    domain: 'mecca.com.au',
    zipcode: '',
  },
  implementation,
};
