
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    openSearchDefinition: {
      template: 'https://www.lowes.com/search?searchTerm={searchTerms}&page={page}'
    },
    // nextLinkSelector: 'ul[data-selector="splp-pag-lst"] li:last-child a:not(.disabled)',
    // nextLinkXpath: "//ul[@data-selector='splp-pag-lst']//li[last()]//a[not(contains(@class,'disabled'))]",
    mutationSelector: 'div.plt div',
    spinnerSelector: null,
    loadedSelector: 'section#main',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")]',
    
    domain: 'lowes.com',
    zipcode: '',
  },
};
