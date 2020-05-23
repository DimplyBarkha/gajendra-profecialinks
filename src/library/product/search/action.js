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
  ],
  inputs: [
    {
      name: 'keywords',
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
    execute: 'action:product/search/execute/stores/${store[0:1]}/${store}/${country}',
    paginate: 'action:product/search/paginate/stores/${store[0:1]}/${store}/${country}',
    extract: 'action:product/search/extract/stores/${store[0:1]}/${store}/${country}',
  },
  path: 'stores/${store[0:1]}/${store}/${country}',
  implementation: async ({ keywords, results = 100 }, { country, store }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    // do the search
    await execute({ keywords });

    // try gettings some search results
    const pageOne = await extract({});

    let collected = length(pageOne);

    console.log('Got initial number of results', collected);

    // check we have some data
    if (collected === 0) {
      return;
    }

    while (collected < results && await paginate()) {
      const data = await extract({});
      const count = length(data);
      if (count === 0) {
        // no results
        break;
      }
      collected += count;
      console.log('Got more results', collected);
    }
  },
};
