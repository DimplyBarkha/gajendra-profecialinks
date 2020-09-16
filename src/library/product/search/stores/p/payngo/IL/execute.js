
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    domain: 'payngo.co.il',
    url: 'https://www.payngo.co.il/instantsearchplus/result?q={searchTerms}',
    loadedSelector: 'div#isp_center_container > ul#isp_search_results_container > li',
    noResultsXPath: "//li[contains(string(), 'no results found')] | //h2[contains(string(), 'שגיאה 404')]",
    zipcode: '',
  },
};
