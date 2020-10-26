
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    nextLinkSelector: 'div#hawkbottompager a.hawk-arrowRight',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#hawkitemlist',
    noResultsXPath: '//div[@id="hawkitemlist" and contains(.,"Search was unable to find any results")]',
    openSearchDefinition: null,
    domain: 'riverbendhome.com',
    zipcode: "''",
  },
};
