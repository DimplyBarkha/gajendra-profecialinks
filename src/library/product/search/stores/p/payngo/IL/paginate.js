
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#isp_center_container > ul#isp_search_results_container > li',
    //noResultsXPath: "//li[contains(string(), 'no results found')] | //h2[contains(string(), 'שגיאה 404')]",
    //noResultsXPath: "//li[contains(string(), 'no results found')] | //h2[contains(string(), 'שגיאה 404')] | //ul//li[contains(@class,'no_results_title')]",
    noResultsXPath: "//li[contains(string(), 'no results found')] | //h2[contains(string(), 'שגיאה 404')] | //div[contains(@class,'results_summary_wrapper')]//*[contains(@id,'header_subtitle')][contains(.,'0  תוצאות')]|//div[contains(@class,'results_summary_wrapper')]//*[contains(@id,'header_subtitle')][contains(.,'0 results')]",
    openSearchDefinition: null,
    domain: 'payngo.co.il',
    zipcode: '',
  },
};
