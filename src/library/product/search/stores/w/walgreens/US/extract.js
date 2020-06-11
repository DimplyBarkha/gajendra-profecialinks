const { transform } = require('../../../../shared');

async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (i, productCards, productInfo) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.style.display = 'none';
      const skuId = productCards[i].querySelector('a').getAttribute('id').split('_sku')[1];
      newDiv.dataset.id = skuId !== undefined ? skuId : productCards[i].querySelector('a').getAttribute('id').split('compare_')[1];
      newDiv.dataset.url = 'https://www.walgreens.com' + productCards[i].querySelector('a').getAttribute('href');
      newDiv.dataset.thumbnail = 'https://' + productCards[i].querySelector('img').getAttribute('src').slice(2);
      const reForRatings = /(\d*\.?\d+) out of 5/;
      if (productCards[i].querySelector('.wag-prod-review-info').querySelector('img')) {
        const ratingText = productCards[i].querySelector('.wag-prod-review-info').querySelector('img').getAttribute('title');
        if (ratingText) {
          newDiv.dataset.rating = ratingText.replace(reForRatings, '$1');
        } else {
          // @ts-ignore
          newDiv.dataset.rating = 0.0;
        }
      } else {
        // @ts-ignore
        newDiv.dataset.rating = 0.0;
      }
      const priceDiv = productCards[i].querySelector('div.wag-prod-price-info span.sr-only');
      const re = /\$(\d+) and (\d+) cents/;
      if (priceDiv) {
        const priceText = priceDiv.textContent;
        if (priceText.includes('Sale price')) {
          const price = priceText.split('And')[0];
          newDiv.dataset.price = price.replace(re, '$1.$2');
        } else if (priceText.includes('1 for')) {
          newDiv.dataset.price = (priceText.split('1 for')[1]).replace(/\$*(\d+) dollars and (\d+) cents/, '$1.$2');
        } else {
          const price = priceText;
          newDiv.dataset.price = price.replace(re, '$1.$2');
        }
      }

      if (productInfo !== null) {
        newDiv.dataset.id = productInfo[i].productInfo.wic;
        newDiv.dataset.upc = productInfo[i].productInfo.upc;
        newDiv.dataset.rating = productInfo[i].productInfo.averageRating;
      }
      productCards.item(i).appendChild(newDiv);
    }

    const refURL = window.location.href;
    let productInfo = null;
    if (document.querySelector('.pagination') !== null) {
      const pageNum = parseInt(document.querySelector('.pagination').querySelector('input').value);

      const response = await fetch('https://www.walgreens.com/productsearch/v1/products/search', {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json; charset=UTF-8',
          pragma: 'no-cache',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        referrer: refURL,
        referrerPolicy: 'no-referrer-when-downgrade',
        // @ts-ignore
        body: '{"p":' + pageNum + ',"s":24,"view":"allView","geoTargetEnabled":false,"abtest":["tier2","showNewCategories"],"deviceType":"desktop","q":"' + window.__APP_INITIAL_STATE__.search.searchString + '","requestType":"search","sort":"relevance","couponStoreId":"4372"}',
        method: 'POST',
        mode: 'cors',
      });

      if (response && response.status === 404) {
        console.log('Product Not Found!!!!');
      }

      if (response && response.status === 200) {
        console.log('Product Found!!!!');
        const data = await response.json();
        console.log(data);
        productInfo = data.products;
      }
    } else {
      // @ts-ignore
      productInfo = window.__APP_INITIAL_STATE__.searchResult.productList;
    }

    const productCards = document.getElementsByClassName('wag-product-card-details');
    let i = 0;
    while (i < productCards.length) {
      if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
        // @ts-ignore
        document.getElementById(i).remove();
      }
      addHiddenDiv(i, productCards, productInfo);
      i++;
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    transform: transform,
    domain: 'walgreens.com',
  },
  implementation,
};
