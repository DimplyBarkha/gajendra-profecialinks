
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'dyson',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.search-results__results-list li',
    openSearchDefinition: null,
    // nextLinkSelector: 'a.search-pagination__text.js-search-pagination-link',
    // spinnerSelector: '.active .js-search-loader',
    noResultsXPath: '//form[contains(@class, "search-results__form")]//following-sibling::*[contains(text(), "nie zwróciło wyników")]',

    domain: 'dyson.pl',
    zipcode: '',
  },
};
