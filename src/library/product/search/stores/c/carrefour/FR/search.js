
module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    domain: 'carrefour.fr',
    zipcode: '',
  },
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

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({results});

    let collected = length(pageOne);

    console.log(`Got initial number of results: ${collected}`);

    // check we have some data
    if (collected === 0) {
      console.log('Was not able to collect any data on the first page');
      return;
    }

    let page = 2;
    while (collected < results && await paginate({ keywords: inputKeywords, page, offset: collected })) {
      const data = await extract({results});
      const count = length(data);
      if (count === 0) break; // no results
      collected += count;
      console.log('Got more results', collected);
      page++;
    }
  },
};
