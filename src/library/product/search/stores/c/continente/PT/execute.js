
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'continente',
    domain: 'continente.pt',
    url: 'https://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k={searchTerms}',
    loadedSelector: 'td#MSOZoneCell_WebPartctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783',
    noResultsXPath: '//div[contains(@class,"searchNotification")]/span/font/font[contains(text(),"returned no results.")]',
    zipcode: '',
  },
};
