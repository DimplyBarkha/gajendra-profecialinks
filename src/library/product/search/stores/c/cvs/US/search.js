
module.exports = {  
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
  },
  dependencies: {
    execute: 'action:product/search/execute',
    paginate: 'action:product/search/paginate',
    extract: 'action:product/search/extract',
  },
  implementation: async ({ keywords, Keywords, results = 720 }, { country, store }, context, { execute, extract, paginate }) => {
    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);
    console.log("The total number of results" + results);
    keywords = (Keywords) || (keywords);

    // do the search
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
