/**
 *
 * @param { { URL: string, zipcode: string } } inputs
 * @param { { store: any, country: any, zipcode: any, storeId: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { URL } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const zipcode = inputs.zipcode || parameters.zipcode;

  const newInput = { ...inputs, zipcode, url };

  const resultsReturned = await execute(newInput);
  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  await extract(newInput);
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
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
    },
    {
      name: 'zipcode',
      description: 'to set location',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'URL',
      description: 'direct url for product',
      type: 'string',
      optional: true,
    },
    {
      name: 'zipcode',
      description: 'zipcode',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/listing/execute',
    extract: 'action:product/listing/extract',
  },
  path: './listing/stores/${store[0:1]}/${store}/${country}/listing',
  implementation,
};
