
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    domain: 'flipkart.com',
    url: 'https://www.flipkart.com/search?q={searchTerms}',
    loadedSelector: 'div._13oc-S>div > div._4ddWXP > a._2rpwqI > div >div>div> img ,div.MIXNux > div._2QcLo- > div > div > img',//'html body',//'div._3LxdjL._3NzWOH' ,
    noResultsXPath: '//div[@class="DUFPUZ"]',
    zipcode: "''",
  },
};
