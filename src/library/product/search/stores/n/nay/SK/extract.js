const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function getSearchTerm (refUrl) {
      const currentUrl = refUrl;
      const search = currentUrl.match(/q=([^&]*)/) ? currentUrl.match(/q=([^&]*)/)[1] : ' ';
      // console.log(search);
      return search;
    }

    async function fetchProducts (search, page) {
      const refURL = window.location.href;
      const fetchURL = `https://live.luigisbox.com/search?tracker_id=14457-16493&f[]=availability_rank_text:IN_STOCK&f[]=availability_rank_text:NOT_IN_STOCK&f[]=availability_rank_text:AVAILABILITY_SOLD&f[]=availability_rank_text:EXHIBIT_ON_ESHOP&f[]=availability_rank_text:AVAILABILITY_NOT_AVAILABLE&f[]=availability_rank_text:CURRENTLY_NOT_AVAILABLE&f[]=availability_rank_text:AVAILABILITY_PREORDER&f[]=availability_rank_text:UNAVAILABLE_FOR_SALE_ACTION&f[]=type:public_product&q=${search}&facets=price_amount,availability_rank_text,producer,product_category,availability_on_warehouse&quicksearch_types=brand,category,common_page,article&size=200&page=${page}`;
      console.log('fetchURL: ', fetchURL);
      const response = await fetch(fetchURL, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,mr-IN;q=0.8,mr;q=0.7',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: refURL,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      });

      if (response && response.status === 400) {
        throw new Error('Error when calling API');
      }

      if (response && response.status === 404) {
        // console.log('Product Not Found!!!!');
      }

      if (response && response.status === 200) {
        // console.log('Product Found!!!!');
        const data = await response.json();
        // console.log(response);
        return data;
      }
    }

    let i = 1;
    const searchUrl = window.location.href;
    var search = getSearchTerm(searchUrl);
    await new Promise(r => setTimeout(r, 10000));
    var dict = {};
    while (document.querySelector('#col-content .btn')) {
      // var itemContainer = document.querySelectorAll('#lb-results > div > div > ul > li > div > div > a');
      if (i < 8) {
        const apiData = await fetchProducts(search, i);

        if (apiData !== undefined) {
          var element = apiData.results.hits;
          for (var k = 0; k < element.length; k++) {
            var productUrl = `https://www.nay.sk${element[k].attributes.original_url}`;
            var pId = element[k].attributes.item_id;
            dict[productUrl] = pId;
            console.log(pId);
          }
        }
        document.querySelector('#col-content .btn').click();
        await new Promise(r => setTimeout(r, 10000));
        i++;
      } else {
        break;
      }
    }
    if (!document.querySelector('#col-content .btn')) {
      const apiData = await fetchProducts(search, i);

      if (apiData !== undefined) {
        var element = apiData.results.hits;
        for (var k = 0; k < element.length; k++) {
          var productUrl = `https://www.nay.sk${element[k].attributes.original_url}`;
          var pId = element[k].attributes.item_id;
          dict[productUrl] = pId;
          console.log(pId);
        }
      }
    }
    var count = 0;
    for (var key in dict) {
      const prodEl = document.querySelector(`a[href*="${key}"]`);
      if (prodEl) {
        prodEl.setAttribute('selector', 'productLink');
        prodEl.setAttribute('productId', dict[key]);
        if (prodEl.querySelector('.rating')) {
          var c = prodEl.querySelector('.rating');
          let singleRating = c.style.width;
          singleRating = singleRating.slice(0, singleRating.length - 1);
          singleRating = (5 * singleRating) / 100;
          singleRating = singleRating.toFixed(1);
          prodEl.setAttribute('aggregateRating', singleRating);
        }
        console.log(prodEl);
        count++;
      }
      if (count >= 168) {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    transform: transform,
    domain: 'nay.sk',
    zipcode: '',
  },
  implementation,
};
