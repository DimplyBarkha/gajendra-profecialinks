
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    resultsDivSelector: 'ul[id="lpBloc"]',
    nextLinkSelector: null,//'div.pgLightPrevNext > a[class*=NxtPage]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id="lpBloc"]',
    noResultsXPath: '//*[@class="lrTryAgain"] | //*[@class="noResult"] | //body/img[@class="centerImage pc"]',
    openSearchDefinition: {
      template: 'https://www.cdiscount.com/search/10/{searchTerms}.html?page={page}&_his_',
    },
    domain: 'cdiscount.com',
    zipcode: '',
  },
};