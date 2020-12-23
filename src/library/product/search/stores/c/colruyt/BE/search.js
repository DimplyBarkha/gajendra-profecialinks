
module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    domain: 'colruyt.be',
    zipcode: '',
  },
  implementation: async ({ keywords, Keywords, Brands, results = 150 }, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    keywords = (Keywords) || (Brands) || (keywords);
    console.log('zip:' + zipcode);

    const resultsReturned = await execute({ keywords, zipcode });

    // do the search

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    // try gettings some search results
    const pageOne = await extract({ results });

    const collected = length(pageOne);

    console.log('Got initial number of results', collected);

    // check we have some data
    if (collected === 0) {

    }
  },
};
