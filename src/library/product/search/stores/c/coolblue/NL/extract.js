const { transform } = require('../../../../shared');

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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const products = document.querySelectorAll('div.product-card');
      if (products) {
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          product.setAttribute('searchUrl', window.location.href);
          product.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await stall(200);
        }
        await stall(2000);
      }
    });
  };
  await applyScroll(context);
  const dataRef = await context.extract(productDetails, { transform });
  for (const { group } of dataRef) {
    for (const row of group) {
      if (row.aggregateRating2) {
        row.aggregateRating2[0].text = row.aggregateRating2[0].text.replace('.', ',');
      }
    }
  }
  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation,
};
