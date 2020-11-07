
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    // nextLinkSelector: 'div.paging-numbers > a',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div#products',
    noResultsXPath: '//div[@id="empty-search"]',
    //openSearchDefinition: null,
    openSearchDefinition: {
      template: 'https://www.euro.com.pl/search,strona-{page}.bhtml?keyword={searchTerms}',
    },    
    domain: 'euro.com.pl',
    zipcode: '',
  },
};
