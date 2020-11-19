
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    nextLinkSelector: 'div[class="palm--soft--top"] ul[class*="nav nav--block pagination"] li a[class="icon--arrow-skinny-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'h3-like')]/parent::div[@class='grid__item']",
    openSearchDefinition: null,
    domain: 'iga.net',
    zipcode: '',
  },
};
