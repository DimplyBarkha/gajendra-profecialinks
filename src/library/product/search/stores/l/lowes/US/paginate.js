
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: 'li:last-child a.arrow',
    loadedSelector: 'div.pl,#main-section',
    noResultsXPath: '//h1[contains(@data-selector,"splp-noresult-page-heading")]',
    domain: 'lowes.com',
  },
};
