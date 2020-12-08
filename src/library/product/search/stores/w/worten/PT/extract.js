const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('div.w-product-list__row');
  await context.evaluate(async function () {
    var popup = document.querySelector('div.w-cookies-popup__footer__primary-button button');
    if (popup) {
      popup.click();
    }
    function timeout (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const id = window.location.href.match('[^=]$')[0];
    const searchTerm = window.location.href.replace(new RegExp('(.+query=)(.+)(&so.+)', 'g'), '$2');
    const response = await fetch("https://www.worten.pt/api/search/0/products/_search", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": `https://www.worten.pt/search?query=${searchTerm}&sortBy=relevance&hitsPerPage=24&page=${id}`,
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": `{\"requests\":[{\"indexName\":\"search-prd-wes-products_rank1\",\"params\":\"query=${searchTerm}&attributesToHighlight=%5B%5D&attributesToRetrieve=%5B%22*%22%2C%22-facets%22%5D&clickAnalytics=true&facets=price_range%2Ccategory_tree_lbls.level2%2Cbrand&hitsPerPage=24&page=${id - 1}\"},{\"indexName\":\"search-prd-wes-products_rank1\",\"params\":\"query=%20black%20game&attributesToHighlight=%5B%5D&attributesToRetrieve=%5B%22*%22%2C%22-facets%22%5D&facets=price_range%2Ccategory_tree_lbls.level2%2Cbrand&hitsPerPage=0&page=0\"}]}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"

    });
    const json = await response.json();

    const arr = json.results;
    const dataArr = arr[0].hits;
    await timeout(2000);
    dataArr.forEach(item => {
      if (item.rating_bazaar) {
        document.querySelectorAll('#products-list-block > div').forEach(val => {
          var sku = val.getAttribute('data-sku');
          if (sku === item.sku) {
            var rating = Number(item.rating_bazaar).toFixed(1).replace('.', ',');
            val.querySelector('div.w-product__wrapper a').setAttribute('aggregaterating', rating);
          }
        });
      }
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    transform,
    domain: 'worten.pt',
  },
  implementation,
};
