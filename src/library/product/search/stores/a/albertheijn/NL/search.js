module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'NL',
    store: 'albertheijn',
    domain: 'ah.nl',
    zipcode: '',
  },
  implementation: async ({ keywords, Keywords, Brands, results = 150 }, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    keywords = (Keywords) || (Brands) || (keywords);
    console.log('zip:' + zipcode);
    // do the search
    const resultsReturned = await execute({ keywords, zipcode, results });

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({});

    const collected = length(pageOne);

    console.log('Got initial number of results', collected);

    // check we have some data
    if (collected === 0) {

    }
  },
};
