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

    function addHiddenDiv (i, productCards, productInformation, sponsoredProductInformation, sponsoredCounter, orgRankCounter, rankCounter, isSponsored) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.style.display = 'none';
      newDiv.dataset.url = 'https://www.walgreens.com' + productCards[i].querySelector('a').getAttribute('href');
      newDiv.dataset.thumbnail = 'https://' + productCards[i].querySelector('img').getAttribute('src').slice(2);
      if (isSponsored) {
        newDiv.dataset.sponsor = 'true';
      }
      const priceDiv = (productCards && productCards[i]) ? productCards[i].querySelector('div.wag-prod-price-info span.sr-only') : undefined;
      let hasPriceDeal = false;
      if (priceDiv) {
        const priceText = priceDiv.textContent;
        if (priceText.includes('1 for')) {
          hasPriceDeal = true;
          newDiv.dataset.price = (priceText.split('1 for')[1]).replace(/\$*(\d+) dollars and (\d+) cents/, '$1.$2');
        } else if (priceText.match(/\$*(\d+) and (\d+) cents/g)) {
          newDiv.dataset.price = priceText.replace(/\$*(\d+) and (\d+) cents/g, '$1.$2');
        } else if (priceText.includes('Sale price')) {
          const price = priceText.split('And')[0];
          newDiv.dataset.price = price.replace(/\$(\d+) and (\d+) cents/, '$1.$2');
        }
      }

      const reviewRatings = (productCards && productCards[i] && productCards[i].querySelector('.wag-prod-review-info').querySelector('img')) ? productCards[i].querySelector('.wag-prod-review-info').querySelector('img') : null;
      if (reviewRatings && reviewRatings.getAttribute('title')) {
        const ratingText = reviewRatings.getAttribute('title');
        const reForRatings = /(\d*\.?\d+) out of 5/;
        newDiv.dataset.rating = ratingText.replace(reForRatings, '$1');
      }

      let count = i;

      if (orgRankCounter !== rankCounter) {
        count = orgRankCounter - 1;
      }

      if (isSponsored && sponsoredProductInformation !== null && sponsoredProductInformation[sponsoredCounter] !== null && sponsoredProductInformation[sponsoredCounter] !== undefined) {
        newDiv.dataset.id = (sponsoredProductInformation[sponsoredCounter].productInfo && sponsoredProductInformation[sponsoredCounter].productInfo.wic) ? sponsoredProductInformation[sponsoredCounter].productInfo.wic : '';
        newDiv.dataset.upc = (sponsoredProductInformation[sponsoredCounter].productInfo && sponsoredProductInformation[sponsoredCounter].productInfo.upc) ? sponsoredProductInformation[sponsoredCounter].productInfo.upc : '';
      }

      if (!isSponsored && productInformation !== null && productInformation[count] !== null && productInformation[count] !== undefined) {
        newDiv.dataset.id = (productInformation[count].productInfo && productInformation[count].productInfo.wic) ? productInformation[count].productInfo.wic : '';
        newDiv.dataset.upc = (productInformation[count].productInfo && productInformation[count].productInfo.upc) ? productInformation[count].productInfo.upc : '';
        newDiv.dataset.rating = (productInformation[count].productInfo && productInformation[count].productInfo.averageRating) ? productInformation[count].productInfo.averageRating : '';
        if (productInformation[count].productInfo && productInformation[count].productInfo.priceInfo && hasPriceDeal === false) {
          newDiv.dataset.price = (productInformation[count].productInfo.priceInfo.salePrice) ? (productInformation[count].productInfo.priceInfo.salePrice) : (productInformation[count].productInfo.priceInfo.regularPrice ? productInformation[count].productInfo.priceInfo.regularPrice : '');
        }
      }

      if (productCards && productCards.item(i)) {
        productCards.item(i).appendChild(newDiv);
      }
    }

    let productNotFound = false;
    let productInformation = null;
    let sponsoredProductNotFound = false;
    let sponsoredProductInformation = null;

    async function fetchSponsoredItems (sponsoredProductsArr) {
      const refURL = window.location.href;
      console.log('sponsoredProductsArr');
      console.log(sponsoredProductsArr);
      const bodyParser = '{"products":' + JSON.stringify(sponsoredProductsArr) + '}';
      console.log('bodyParser');
      console.log(bodyParser);
      const response = await fetch('https://www.walgreens.com/productsearch/v1/products/productsInfo', {
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
        sponsoredProductNotFound = true;
      }

      if (response && response.status === 200) {
        console.log('Product Found!!!!');
        const data = await response.json();
        sponsoredProductInformation = data;
        sponsoredProductInformation = data.productList;
        return sponsoredProductInformation;
      }
      return {};
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    const sponsoredProductsList = document.querySelectorAll('div.wag-product-card-details div.sponsored-text');
    const sponsoredProductsListNum = sponsoredProductsList.length;

    if (sponsoredProductsListNum !== 0) {
      const sponsoredProductsArr = [];
      sponsoredProductsList.forEach((div) => {
        let prodId = div.parentElement ? div.parentElement.id : '';
        prodId = prodId.includes('impBeaconprod') ? prodId.split('impBeaconprod')[1] : (prodId.includes('impBeacon') ? prodId.split('impBeacon')[1] : '');
        sponsoredProductsArr.push(prodId);
      });
      sponsoredProductInformation = await fetchSponsoredItems(sponsoredProductsArr);

      if (Object.keys(sponsoredProductInformation).length === 0 && sponsoredProductNotFound === false) {
        sponsoredProductInformation = await fetchSponsoredItems();
      }
    }

    console.log('sponsoredProductInformation2');
    console.log(sponsoredProductInformation);

    async function fetchItems () {
      const refURL = window.location.href;
      const pageNum = (document.querySelector('.pagination') && document.querySelector('.pagination').querySelector('input')) ? parseInt(document.querySelector('.pagination').querySelector('input').value) : 1;
      const searchQuery = window.__APP_INITIAL_STATE__.search.searchString ? window.__APP_INITIAL_STATE__.search.searchString : ((document.querySelector('.product-search-fullview') && document.querySelector('.product-search-fullview').querySelector('h1')) ? document.querySelector('.product-search-fullview').querySelector('h1').textContent.replace(/"/g, '') : '');
      let bodyParser = '{"p":' + pageNum + ',"s":24,"view":"allView","geoTargetEnabled":false,"abtest":["tier2","showNewCategories"],"deviceType":"desktop","q":"' + searchQuery + '","requestType":"search","sort":"relevance","couponStoreId":"4372"}';
      console.log(window.__APP_INITIAL_STATE__.search);
      // For redirect link
      if (Object.keys(window.__APP_INITIAL_STATE__.search).length === 0) {
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
        productNotFound = true;
      }

      if (response && response.status === 200) {
        console.log('Product Found!!!!');
        const data = await response.json();
        console.log(data);
        productInformation = data.products;
        return productInformation;
      }
      return {};
    }

    const productCards = document.getElementsByClassName('wag-product-card-details');
    // const numberOfProductsWithSponsored = productCards.length;

    // if ((numberOfProducts <= itemsPerPage) && (numberOfProductsWithSponsored <= itemsPerPage)) {
    //   productInformation = (window.__APP_INITIAL_STATE__ && window.__APP_INITIAL_STATE__.searchResult && window.__APP_INITIAL_STATE__.searchResult.searchData) ? window.__APP_INITIAL_STATE__.searchResult.searchData.products : {};
    // } else {
    productInformation = await fetchItems();

    if (Object.keys(productInformation).length === 0 && productNotFound === false) {
      productInformation = await fetchItems();
    }

    if (Object.keys(productInformation).length === 0) {
      throw new Error('API Call fail');
    }

    let i = 0;
    let orgRankCounter = 0;
    let rankCounter = 0;
    let sponsoredCounter = 0;
    while (i < productCards.length) {
      if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
        document.getElementById(i.toString()).remove();
      }
      rankCounter += 1;
      if (productCards[i].querySelector('.sponsored-text') === null) {
        orgRankCounter += 1;
      } else {
        sponsoredCounter += 1;
      }
      addHiddenDiv(i, productCards, productInformation, sponsoredProductInformation, sponsoredCounter - 1, orgRankCounter, rankCounter, productCards[i].querySelector('.sponsored-text') !== null);
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
