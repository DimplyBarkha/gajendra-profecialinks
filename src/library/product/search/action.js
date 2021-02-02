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
    {
      name: 'storeID',
      description: 'Id of the store',
      type: 'string',
      optional: true,
    },
  ],
  inputs: [
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
      name: 'Brands',
      description: 'brands to search for',
      type: 'string',
    },
    {
      name: 'query',
      description: 'Part of a uniform resource locator (URL)',
      type: 'string',
    },
  ],
  dependencies: {
    execute: 'action:product/search/execute',
    paginate: 'action:navigation/paginate',
    extract: 'action:product/search/extract',
  },
  path: './search/stores/${store[0:1]}/${store}/${country}/search',
  implementation: async (inputs, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    const { keywords, Keywords, results = 500, Brands, query } = inputs;

    const inputKeywords = Keywords || keywords || Brands;

    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    const resultsReturned = await execute({
      ...inputs,
      keywords: inputKeywords,
      zipcode: inputs.zipcode || zipcode,
      query: query,
    });

    // do the search

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({});

    let collected = length(pageOne);

    console.log(`Got initial number of results: ${collected}`);

    // check we have some data
    if (collected === 0) {
      console.log('Was not able to collect any data on the first page');
      return;
    }

    let page = 2;
    while (collected < results && await paginate({ keywords: inputKeywords, page, offset: collected })) {
      const data = await extract({});
      const count = length(data);
      if (count === 0) break; // no results
      collected += count;
      console.log('Got more results', collected);
      page++;
    }
  },
};
