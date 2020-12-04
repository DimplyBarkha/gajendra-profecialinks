
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    nextLinkSelector: null, // 'div[class="palm--soft--top"] ul[class*="nav nav--block pagination"] li a[class="icon--arrow-skinny-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'h3-like')]/parent::div[@class='grid__item']",
    openSearchDefinition: {
      template: 'https://www.iga.net/search?t=%7bD9CE4CBE-C8C3-4203-A58B-7CF7B830880E%7d&k={searchTerms}&page={page}',
    },
    domain: 'iga.net',
    zipcode: '',
  },
};
