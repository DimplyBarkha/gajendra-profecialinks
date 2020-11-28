
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    domain: 'payngo.co.il',
    url: 'https://www.payngo.co.il/instantsearchplus/result?q={searchTerms}',
    loadedSelector: 'div#isp_center_container > ul#isp_search_results_container > li',
    noResultsXPath: "//li[contains(string(), 'no results found')] | //h2[contains(string(), 'שגיאה 404')] | //div[contains(@class,'results_summary_wrapper')]//*[contains(@id,'header_subtitle')][contains(.,'0  תוצאות')]|//div[contains(@class,'results_summary_wrapper')]//*[contains(@id,'header_subtitle')][contains(.,'0 results')]",
    zipcode: '',
  },
};
