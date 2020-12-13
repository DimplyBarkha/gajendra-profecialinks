const {cleanUp} = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    while(!!document.querySelector('a.loadMoreButton')){
      // @ts-ignore
      document.querySelector('a.loadMoreButton').onclick()
      await new Promise(r => setTimeout(r, 1000));
    }
  })
  await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform: cleanUp,
    domain: 'feelunique.com',
    zipcode: '',
  },
};
