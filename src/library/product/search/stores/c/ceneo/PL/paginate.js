
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    nextLinkSelector: 'div.pagination-top a',
    loadedSelector: 'div.category-list-body.js_category-list-body.js_search-results div.cat-prod-row.js_category-list-item',
    noResultsXPath: '//div[@class="not-found"]',
    domain: 'ceneo.pl',
    // openSearchDefinition: {
    //   template: 'https://www.ceneo.pl/Odswiezacze_powietrza;szukaj-{searchTerms};0191;0020-30-0-0-{page}.htm',
    // },
    zipcode: '',
  },
};
