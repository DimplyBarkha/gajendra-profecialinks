/**
 *
 * @param { { date: string} } inputs
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
  const { productOffers } = dependencies;

  // Adding current page url
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const currentPageUrl = window.location.href;

    const currentPageDiv = document.querySelector('#currentPageUrl');
    currentPageDiv ? currentPageDiv.textContent = currentPageUrl : addElementToDocument('currentPageUrl', currentPageUrl);
  });

  return await context.extract(productOffers, { transform });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
  ],
  dependencies: {
    productOffers: 'extraction:product/offers/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
