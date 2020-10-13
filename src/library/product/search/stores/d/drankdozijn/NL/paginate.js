module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'drankdozijn',
    nextLinkSelector: 'div[class="pagination"]>ul>li:last-child>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.go',
    noResultsXPath: '//ul[@class="zoeken_suggesties"]',
    openSearchDefinition: null,
    domain: 'drankdozijn.nl',
    zipcode: '',
  },
};
