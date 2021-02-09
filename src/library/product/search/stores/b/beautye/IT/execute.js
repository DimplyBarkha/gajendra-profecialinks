
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    domain: 'beautye.it',
    // url: 'https://www.beautye.it/search/{searchTerms}',
    url: 'https://www.beautye.it/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'li.product-item div div.product-item-photo a img.product-image-photo',
    noResultsXPath: '//div[@class="message notice"]/div/text()',
    zipcode: '',
  },
  //autoScroll,
};
 /*async function autoScroll(page) {
 await page.evaluate(async () => {
 await new Promise((resolve) => {
 var totalHeight = 0;
 var distance = 100;
 var timer = setInterval(() => {
 var scrollHeight = document.body.scrollHeight;
 window.scrollBy(0, distance);
 totalHeight += distance;

 if (totalHeight >= scrollHeight) {
 clearInterval(timer);
 resolve();
}
 }, 100);
 });
 });
 }*/



