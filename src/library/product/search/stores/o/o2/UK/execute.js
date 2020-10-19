module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'o2',
    domain: 'o2.co.uk',
    url: 'https://search.o2.co.uk/?i=1&iframe=1&parentdomain=www.o2.co.uk&q={searchTerms}&q1=Shop&rank=rank_default&view=html&x1=page_type&count=20',
    loadedSelector: '.col-2thirds-search',
    noResultsXPath: '//span[@class="totalCount" and text()=0]',
    zipcode: '',
  },
};
