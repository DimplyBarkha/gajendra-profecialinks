/**
 *
 * @param { { url } } inputs
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
  const { transform, urlTemplate, resultsCountSelector, numberResultPerPage, regExpForIdFromUrl } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  const resultsCount = await context.evaluate((resultsCountSelector) => {
    return document.querySelector(resultsCountSelector).textContent.replace(',', '');
  }, resultsCountSelector);

  const totalPages = Number(resultsCount) / numberResultPerPage;

  const urlArray = [];
  const { url } = inputs;
  const itemId = url.match(regExpForIdFromUrl)[0];

  for (let i = 1; i < totalPages; i++) {
    urlArray.push(urlTemplate.replace('{id}', itemId).replace('{page}', i));
  }

  await helper.addArrayToDocument('my-urls', urlArray);
  await helper.addItemToDocument('my-results-count', resultsCount);

  return await context.extract(productDetails, { transform });
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
      name: 'urlTemplate',
      description: 'template for desired urls, with {page}',
    },
    {
      name: 'resultsCountSelector',
      description: 'selector for total number of results',
    },
    {
      name: 'numberResultPerPage',
      description: 'set as number of results shown per page',
    },
    {
      name: 'regExpForIdFromUrl',
      description: 'regular expression to capture item id from the input url',
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
    Helpers: 'module:helpers/helpers',
    productDetails: 'extraction:product/listing/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
