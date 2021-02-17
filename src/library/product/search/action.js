/**
 *
 * @param { { URL: string, keywords: string, Keywords: string, Brands: string, results: string, query: string } } inputs
 * @param { { store: any, country: any, zipcode: any, storeID: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, paginate: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */

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
<<<<<<< HEAD
    },
    {
      name: 'zipcode',
      description: 'to set location',
      optional: true,
    },
    {
      name: 'storeID',
      description: 'Id of the store',
      type: 'string',
      optional: true,
    },
=======
    }
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
  ],
  inputs: [
    {
      name: 'URL',
      description: 'product listing url',
      type: 'string',
      optional: true,
    },
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'Keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'Brands',
      description: 'brands to search for',
      type: 'string',
    },
    {
      name: 'results',
      description: 'the minimum number of results required',
      type: 'number',
    },
    {
<<<<<<< HEAD
<<<<<<< HEAD
      name: 'Brands',
      description: 'brands to search for',
      type: 'string',
    },
    {
=======
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
      name: 'query',
      description: 'Part of a uniform resource locator (URL)',
=======
      name: 'id',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: '_date',
      description: 'earliest date to extract a review',
      type: 'string',
    },
    {
      name: 'zipcode',
      description: 'to set location',
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
      type: 'string',
    },
  ],
  dependencies: {
    execute: 'action:product/search/execute',
    paginate: 'action:navigation/paginate',
    extract: 'action:product/search/extract',
  },
  path: './search/stores/${store[0:1]}/${store}/${country}/search',
<<<<<<< HEAD
  implementation: async (inputs, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    const { URL, keywords, Keywords, results = 150, Brands, query } = inputs;
    const inputKeywords = Keywords || keywords || Brands;

    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    const resultsReturned = await execute({
      ...inputs,
      searchURL: URL,
      keywords: inputKeywords,
      zipcode: inputs.zipcode || zipcode,
      query: query,
    });

    // do the search
=======
  implementation: async ({ keywords, Keywords, results = 50, id, _date = null, zipcode = null }, { country, store, domain }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    keywords = (Keywords) || (keywords) || (id);

    // do the search
    const resultsReturned = await execute({ keywords, zipcode, _date, context });
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({ _date });

    let collected = length(pageOne);

    console.log(`Got initial number of results: ${collected}`);

    // check we have some data
    if (collected === 0) {
      console.log('Was not able to collect any data on the first page');
      return;
    }

    let page = 2;
<<<<<<< HEAD
    while (collected < results && await paginate({ keywords: inputKeywords, page, offset: collected })) {
      const data = await extract({});
=======
    while (collected < results && await paginate({ keywords, page, offset: collected, _date, context })) {
      const data = await extract({ _date });
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
      const count = length(data);
      if (count === 0) break; // no results
      collected += count;
      console.log('Got more results', collected);
      page++;
    }
  },
};
