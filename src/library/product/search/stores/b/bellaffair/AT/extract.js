const { transform } = require('./../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // add rank attribute
    var rank = document.querySelectorAll('div[class="gridlist_item"]');
  
    rank.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });
  return await context.extract(productDetails, { transform });
};


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform,
    domain: 'bellaffair.at',
  },
  implementation,
};
