
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    // nextLinkSelector: 'div.load-more_root__9MiHC > button',
    // nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-testhook="search-lane"]',
    // noResultsXPath: 'boolean(div[@class="load-more_root__9MiHC"]/button) = 0',
    // noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.ah.be/zoeken?query={searchTerms}&page={page}',
    // },
    domain: 'ah.be',
    zipcode: '',
  },
};
