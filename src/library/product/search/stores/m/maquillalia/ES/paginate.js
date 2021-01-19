
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'maquillalia',
    // nextLinkSelector: null,
    nextLinkSelector: "a[class='Next']",
    // nextLinkSelector: "#main>div:nth-child(2)>div>a.Next",
    // nextLinkXpath: '//a[@class="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: "main.Container",
    loadedSelector: null,
    // loadedXpath: '//div[@class="ListProds BX Row Cols B03 Sp0"]',
    noResultsXPath: null,
    resultsDivSelector: null,
    // openSearchDefinition: null,
    // openSearchDefinition: {
    //   pageStartNb: 1,
    //   template: 'https://www.maquillalia.com/search.php?buscar={searchTerms}&page={page}',
    //   },
    domain: 'maquillalia.com',
    zipcode: '',
  },
};
