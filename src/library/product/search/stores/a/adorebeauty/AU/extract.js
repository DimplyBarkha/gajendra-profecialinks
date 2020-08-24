const { transform } = require('../format');

/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    let loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
    while(loadMore && loadMore.getAttribute('disabled') !== "disabled"){
      await loadMore.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
  implementation
};
