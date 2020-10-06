
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    domain: 'argos.ie',
    url: 'https://www.argos.ie/webapp/wcs/stores/servlet/Search?storeId=10152&searchTerms={searchTerms}',
    loadedSelector: 'img.searchProductImgList',
    noResultsXPath: '//div[@class="error"] | /html/body[not(//div[@id="searchcontent"])]',
    zipcode: '',
  },
};
