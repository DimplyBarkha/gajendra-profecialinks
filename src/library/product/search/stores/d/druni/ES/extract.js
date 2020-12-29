const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'druni',
    transform: transform,
    domain: 'druni.es',
    zipcode: "''",
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function addElementToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }

      // function capitalizeFirstChar (string) {
      //   const rest = string.slice(1).toLowerCase();
      //   return string.charAt(0) + rest;
      // }

      const numOfPages = Math.ceil(200 / 20);

      for (let i = 1; i < numOfPages; i++) {
        const currentUrl = window.location.href;
        const keywords = currentUrl.match(/query=(.+)&/) ? currentUrl.match(/query=(.+)&/)[1] : '';
        const fetchUrlTemplate = `https://eu1-search.doofinder.com/5/search?hashid=8ed7450f44117ffe10dedbb105484e0e&query_counter=1&page=1&rpp=30&transformer=&query_name=match_or&query=${keywords}`;
        const searchUrl = fetchUrlTemplate.replace(/page=1/g, `page=${i}`);
        const response = await fetch(searchUrl, {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
          },
          referrer: 'https://www.druni.es/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        });
        if (response && response.status === 200) {
          const data = await response.json();
          // console.log(data);
          const resultsNumber = data.results ? data.results.length : 0;
          // console.log(resultsNumber);
          for (let j = 0; j < resultsNumber; j++) {
          // if (data.results[j] && data.results[j].defaultVariantCode) {
            addElementToDoc(`productElement-${i * 20 + j}`, i * 20 + j);
            const product = data.results[j];
            const productElemId = `div#productElement-${i * 20 + j}`;
            document.querySelector(productElemId).setAttribute('product-tile-id', product.id);
          // const productBrand = product.brandData ? product.brandData.name ? capitalizeFirstChar(product.brandData.name) : '' : '';
          // document.querySelector(productElemId).setAttribute('product-tile-name', `${productBrand} ${product.name}`);
          // const productUrl = product.url ? `https://www.marionnaud.ch${product.url}` : '';
          // document.querySelector(productElemId).setAttribute('product-tile-url', productUrl);
          // document.querySelector(productElemId).setAttribute('product-tile-search-url', searchUrl);
          // const thumbnail = product.primaryImageUrl ? `https://www.marionnaud.ch${product.primaryImageUrl}` : '';
          // document.querySelector(productElemId).setAttribute('product-tile-thumbnail', thumbnail);
          // const productRating = product.averageRating ? String(product.averageRating).replace('.', ',') : '';
          // document.querySelector(productElemId).setAttribute('product-tile-aggRating', productRating);
          // document.querySelector(productElemId).setAttribute('product-tile-reviewCount', product.numberOfReviews);
          // const price = product.price ? product.price.formattedValue : '';
          // document.querySelector(productElemId).setAttribute('product-tile-price', price);
          // }
          }
        }
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
