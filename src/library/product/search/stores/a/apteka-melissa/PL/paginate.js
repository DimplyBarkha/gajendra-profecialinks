
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    nextLinkSelector: 'ul > li.waves-effect.next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="kontener"]/div/div/h2',
    openSearchDefinition: null,
    domain: 'apteka-melissa.pl',
    zipcode: '',
  },
};
