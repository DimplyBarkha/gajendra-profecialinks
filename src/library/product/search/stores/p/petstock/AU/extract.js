const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
      window.scroll(0, i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    transform: transform,
    domain: 'petstock.com.au',
    zipcode: '',
  },
  implementation,
};
