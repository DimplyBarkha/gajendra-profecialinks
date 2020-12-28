const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    transform: transform,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function addElementToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      const numOfPages = Math.ceil(200 / 20);

      for (let i = 0; i < numOfPages; i++) {
        const pageUrl = window.location.href;
        const searchUrl = pageUrl.replace(/page=0/g, `page=${i}`);
        const response = await fetch(searchUrl, {
          headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
          },
          referrer: 'https://uat.import.io/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        if (response && response.status === 200) {
          const data = await response.json();
          console.log(data);
          const resultsNumber = data.results ? data.results.length : 0;
          console.log(resultsNumber);
          for (let j = 0; j < resultsNumber; j++) {
            if (data.results[j] && data.results[j].defaultVariantCode) {
              addElementToDoc(`productElement-${i * 20 + j}`, i * 20 + j);
              const product = data.results[j];
              const productElemId = `div#productElement-${i * 20 + j}`;
              document.querySelector(productElemId).setAttribute('product-tile-id', product.defaultVariantCode);
              document.querySelector(productElemId).setAttribute('product-tile-name', product.name);
              const productUrl = product.url ? `https://www.marionnaud.ch${product.url}` : '';
              document.querySelector(productElemId).setAttribute('product-tile-url', productUrl);
              document.querySelector(productElemId).setAttribute('product-tile-search-url', searchUrl);
              const thumbnail = product.primaryImageUrl ? `https://www.marionnaud.ch${product.primaryImageUrl}` : '';
              document.querySelector(productElemId).setAttribute('product-tile-thumbnail', thumbnail);
              document.querySelector(productElemId).setAttribute('product-tile-aggRating', product.averageRating);
              document.querySelector(productElemId).setAttribute('product-tile-reviewCount', product.numberOfReviews);
              const price = product.price ? product.price.formattedValue : '';
              document.querySelector(productElemId).setAttribute('product-tile-price', price);
            }
          }
        }
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
