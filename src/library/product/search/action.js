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
      name: 'defaultResults',
      description: 'the minimum number of results required',
      required: false,
      type: 'number',
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
      name: 'results',
      description: 'the minimum number of results required',
      type: 'number',
    },
  ],
  dependencies: {
    execute: 'action:product/search/execute',
    paginate: 'action:product/search/paginate',
    extract: 'action:product/search/extract',
  },
  path: './search/stores/${store[0:1]}/${store}/${country}/search',
  implementation: async ({ keywords, Keywords, results }, { country, store, domain, defaultResults = 150 }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function

    results = (results) ? results : defaultResults;
    console.log('No of results were returned' + results);
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    keywords = (Keywords) || (keywords);
    // await execute({ keywords })
    // await extract({})
    // // do the search
    const resultsReturned = await execute({ keywords });

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({});

    let collected = length(pageOne);

    console.log('Got initial number of results', collected);

    // check we have some data
    if (collected === 0) {
      return;
    }

    let page = 2;
    while (collected < results && await paginate({ keywords, page, offset: collected })) {
      const data = await extract({});
      const count = length(data);
      if (count === 0) {
        // no results
        break;
      }
      collected += count;
      console.log('Got more results', collected);
      page++;
    }
  },
};
