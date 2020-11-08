
module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'FI',
    store: 'kauppahalli24',
    domain: 'kauppahalli24.fi',
    zipcode: '',
  },
  implementation: async ({ keywords, Keywords, Brands, results = 150 }, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    keywords = (Keywords) || (Brands) || (keywords);
    console.log('zip:' + zipcode);
    // do the search
    const resultsReturned = await execute({ keywords, zipcode });

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({ keywords, results });

    const collected = length(pageOne);

    console.log('Got initial number of results', collected);
  },
};
