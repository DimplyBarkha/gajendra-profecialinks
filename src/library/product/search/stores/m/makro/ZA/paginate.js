
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ZA',
    store: 'makro',
    nextLinkSelector: 'div.plp-control-hideMobile i.mak-icon-rightarrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#mak-body-content',
    noResultsXPath: '//div[@class="searchEmpty-title"]/h1[contains(text(),"We couldn\'t find any results for")]',
    openSearchDefinition: null,
    domain: 'makro.co.za',
    zipcode: '',
  },
};
