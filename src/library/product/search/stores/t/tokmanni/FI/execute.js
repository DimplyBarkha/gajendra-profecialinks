
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    domain: 'tokmanni.fi',
    url: 'https://eucs11.ksearchnet.com/cloud-search/n-search/search?ticket=klevu-15488592134928913&term={searchTerms}&paginationStartsFrom=0&sortPrice=false&showOutOfStockProducts=true&klevuFetchPopularTerms=false&klevu_priceInterval=500&fetchMinMaxPrice=true&klevu_multiSelectFilters=true&noOfResults=48&klevuSort=rel&enableFilters=true&visibility=search&category=KLEVU_PRODUCT&klevu_filterLimit=50&lsqt=OR&responseType=json#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'td.result.depth_0 > table > tbody > tr',
    noResultsXPath: 'div.alert.alert-danger',
    zipcode: '',
  },
};
