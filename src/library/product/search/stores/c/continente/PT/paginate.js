
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'continente',
    nextLinkSelector: 'div.topPaging div.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td#MSOZoneCell_WebPartctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783',
    noResultsXPath: '//div[contains(@class,"searchNotification")]/span/font/font[contains(text(),"returned no results.")]',
    openSearchDefinition: null,
    domain: 'continente.pt',
    zipcode: '',
  },
};
