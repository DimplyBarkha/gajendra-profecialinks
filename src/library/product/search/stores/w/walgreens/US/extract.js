const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function (inputs) {
    const filteredUrl = window.location.href.replace(/%20/g, ' ');
    const urlDiv = document.createElement('div');
    urlDiv.id = 'filtered-url';
    urlDiv.style.display = 'none';
    urlDiv.textContent = filteredUrl;
    document.body.appendChild(urlDiv);

    function addHiddenDiv (i, productCards, productInfo) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.style.display = 'none';
      newDiv.dataset.url = 'https://www.walgreens.com' + productCards[i].querySelector('a').getAttribute('href');
      newDiv.dataset.thumbnail = 'https://' + productCards[i].querySelector('img').getAttribute('src').slice(2);

      const priceDiv = (productCards && productCards[i]) ? productCards[i].querySelector('div.wag-prod-price-info span.sr-only') : undefined;
      let hasPriceDeal = false;
      if (priceDiv) {
        const priceText = priceDiv.textContent;
        if (priceText.includes('1 for')) {
          hasPriceDeal = true;
          newDiv.dataset.price = (priceText.split('1 for')[1]).replace(/\$*(\d+) dollars and (\d+) cents/, '$1.$2');
        }
      }

      if (productInfo !== null && productInfo[i] !== null) {
        newDiv.dataset.id = (productInfo[i].productInfo && productInfo[i].productInfo.wic) ? productInfo[i].productInfo.wic : '';
        newDiv.dataset.upc = (productInfo[i].productInfo && productInfo[i].productInfo.upc) ? productInfo[i].productInfo.upc : '';
        newDiv.dataset.rating = (productInfo[i].productInfo && productInfo[i].productInfo.averageRating) ? productInfo[i].productInfo.averageRating : '';
        if (productInfo[i].productInfo && productInfo[i].productInfo.priceInfo && hasPriceDeal === false) {
          newDiv.dataset.price = (productInfo[i].productInfo.priceInfo.salePrice) ? (productInfo[i].productInfo.priceInfo.salePrice) : (productInfo[i].productInfo.priceInfo.regularPrice);
        }
      }

      if (productCards && productCards.item(i)) {
        productCards.item(i).appendChild(newDiv);
      }
    }

    async function fetchProducts (pageNum) {
      const refURL = window.location.href;
      const search = document.querySelector('.c-list-view-settings__list-info').querySelectorAll('strong')[1].textContent;

      const response = await fetch('https://search.unbxd.io/ed39b885dbb44eca3c2782623eb2ba9d/www-foodservicedirect-com-805741548149387/search?q=' + search + '&rows=32&format=json&f.categoryPath.nameId=false&filter=product_websites:%22base%22&start=' + pageNum, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'sec-fetch-dest': 'script',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: refURL,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      });

      if (response && response.status === 404) {
        console.log('Product Not Found!!!!');
      }

      if (response && response.status === 200) {
        console.log('Product Found!!!!');
        const data = await response.json();
        addAllHiddenDiv(data.response.products);
        return data;
      }
    }

    const refURL = window.location.href;
    let productInfo = null;
    const pageNum = (document.querySelector('.pagination') && document.querySelector('.pagination').querySelector('input')) ? parseInt(document.querySelector('.pagination').querySelector('input').value) : 1;
    const searchQuery = (document.querySelector('.product-search-fullview') && document.querySelector('.product-search-fullview').querySelector('h1')) ? document.querySelector('.product-search-fullview').querySelector('h1').textContent : window.__APP_INITIAL_STATE__.search.searchString;
    let bodyParser = '{"p":' + pageNum + ',"s":24,"view":"allView","geoTargetEnabled":false,"abtest":["tier2","showNewCategories"],"deviceType":"desktop","q":"' + searchQuery + '","requestType":"search","sort":"relevance","couponStoreId":"4372"}';
    console.log(window.__APP_INITIAL_STATE__.search);
    if (Object.keys(window.__APP_INITIAL_STATE__.search).length === 0) {
      console.log('OVER HERE');
      const conID = (window.__APP_INITIAL_STATE__.searchResult.filterInfo.id);
      console.log(conID);
      bodyParser = '{"p":' + pageNum + ',"s":24,"view":"allView","geoTargetEnabled":false,"abtest":["tier2","showNewCategories"],"deviceType":"desktop","id":[' + conID + '],"requestType":"tier3","source":"rootTier3","sort":"Top Sellers","couponStoreId":"4372"}';
      console.log(bodyParser);
    }
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
      body: bodyParser,
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

    // function addAllHiddenDiv (productInfo) {
      const productCards = document.getElementsByClassName('wag-product-card-details');
      let i = 0;
      while (i < productCards.length) {
        if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
          document.getElementById(i.toString()).remove();
        }
        addHiddenDiv(i, productCards, productInfo);
        i++;
      }
    // }

    // fetchProducts()
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
