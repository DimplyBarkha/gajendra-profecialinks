
module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "FR",
    store: "cdiscount",
    nextLinkSelector: "div.pgLightPrevNext > a[class*=NxtPage]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id="lpBloc"]',
    noResultsXPath:
      '//*[@class="lrTryAgain"] | //*[@class="noResult"] | //body/img[@class="centerImage pc"]',
    //stopConditionSelectorOrXpath: 'ul[id="lpBloc"]',
    // openSearchDefinition: {
    //   template:
    //     "https://www.cdiscount.com/search/10/{searchTerms}.html?page={page}&_his_",
    // },
    domain: "cdiscount.fr",
    zipcode: "",
  },
};