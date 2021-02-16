


module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    domain: 'beautye.it',
    zipcode: '',
  },
  implementation: async (inputs, { country, store, domain, zipcode }, context, { execute, extract, paginate }) => {
    const { keywords, Keywords, results = 150, Brands } = inputs;

    const inputKeywords = Keywords || keywords || Brands;

    // TODO: consider moving this to a reusable function
    const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

    const resultsReturned = await execute({
      keywords: inputKeywords,
      zipcode: inputs.zipcode || zipcode,
    });

    // do the search

    if (!resultsReturned) {
      console.log('No results were returned');
      return;
    }

    //overridden pagination Stop condition  
    async function checkStopCondition(stopConditionSelectorOrXpath) {
      return await context.evaluate(async function (stopConditionSelectorOrXpath) {
        const isThere = document.querySelector(stopConditionSelectorOrXpath);
        console.log('check paginate', !!isThere);
        return !!isThere;
      }, stopConditionSelectorOrXpath)
    }
    let IS_PAGINATION = await checkStopCondition('div#amasty-shopby-product-list > div:nth-child(4) > div.pages > ul > li[class*="item current"] + li a');
    console.log('is pagination', IS_PAGINATION);


    // try gettings some search results
    const pageOne = await extract({});

    let collected = length(pageOne);

    console.log('Got initial number of results', collected);

    // check we have some data
    if (collected === 0) return;

    let page = 2;
    while (collected < results && IS_PAGINATION && await paginate({ keywords: inputKeywords, page, offset: collected })) {
      const data = await extract({});
      const count = length(data);
      if (count === 0) break; // no results
      collected += count;
      console.log('Got more results', collected);
      IS_PAGINATION = await checkStopCondition('div#amasty-shopby-product-list > div:nth-child(4) > div.pages > ul > li[class*="item current"] + li a');
      page++;
    }
  }
};
