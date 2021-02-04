
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_fr',
    domain: 'mediamarkt.ch',
    url: 'https://www.mediamarkt.ch/fr/search.html?query={searchTerms}&searchProfile=onlineshop',
    loadedSelector: 'ul[class=products-list]',
    noResultsXPath: '//div[contains(@id, "search_no_result")] | //h1[contains(text(), "404")] | //div[contains(@class, "outer-brand")] | //body[contains(@class, "page-product")]',
    zipcode: "''",
  },
};
