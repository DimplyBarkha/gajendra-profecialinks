
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    // url: "https://www.feelunique.com/search?q={searchTerms}",
    url: "https://www.feelunique.com/search?csf=true&q={searchTerms}&go=",
    // url: "https://www.feelunique.com/search?q={searchTerms}&filter=fh_location=//c1/en_GB/$s={searchTerms}/!exclude_countries%3E{gb}/!site_exclude%3E{1}/!brand={a70}/%26customer-country=GB%26site_id=1%26refsearch={searchTerms}%26device=desktop%26site_area=search%26fh_view_size=150%26fh_start_index150",
    loadedSelector: 'div[class="Product"]',
    noResultsXPath: null,
    zipcode: '',
  },
  
};
