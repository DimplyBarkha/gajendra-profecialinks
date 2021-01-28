const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    transform,
    domain: 'marionnaud.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      const numOfPages = Math.ceil(150 / 20);
      const pageWithResults = document.querySelector('div.product-tile__container');
      if (pageWithResults) {
        for (let i = 0; i < numOfPages; i++) {
          if (document.querySelector('[data-ref="loadMoreBtn"]')) document.querySelector('[data-ref="loadMoreBtn"]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          const pageUrl = window.location.href;
          let responseUrl = '';
          if (pageUrl.includes('search?text')) {
            const searchTerm = pageUrl.replace('https://www.marionnaud.at/search?text=', '');
            responseUrl = `https://www.marionnaud.at/search/results?page=${i}&resultsForPage=20&q=${searchTerm}`;
          } else responseUrl = `${pageUrl}/results?page=${i}&resultsForPage=20`;

          const response = await fetch(responseUrl, {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9,pl;q=0.8',
              'cache-control': 'max-age=0',
              'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
              'sec-ch-ua-mobile': '?0',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'x-csrf-token': '33d9fe69-59cf-4e69-913e-49eb0e624535',
              'x-requested-with': 'XMLHttpRequest',
            },
            referrer: pageUrl,
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          }).then(resp => resp.json());
          console.log(response.results);
          if (response) {
            const resultsNumber = response.results ? response.results.length : 0;
            console.log(resultsNumber);
            for (let j = 0; j < resultsNumber; j++) {
              addEleToDoc(`productElement-${i * 20 + j}`, i * 20 + j);
              const product = response.results[j];
              const productElemId = `div#productElement-${i * 20 + j}`;
              document.querySelector(productElemId).setAttribute('product-tile-id', product.defaultVariantCode);
              const brandName = product.brandData ? (product.brandData.name).toUpperCase() : '';
              document.querySelector(productElemId).setAttribute('product-tile-name', `${brandName} ${product.escapeRangeName} ${product.escapeName}`);
              const productUrl = product.url ? `https://www.marionnaud.at${product.url}` : '';
              document.querySelector(productElemId).setAttribute('product-tile-url', productUrl);
              document.querySelector(productElemId).setAttribute('product-tile-search-url', pageUrl);
              const thumbnail = product.primaryImageUrl ? `https://www.marionnaud.at${product.primaryImageUrl}` : '';
              document.querySelector(productElemId).setAttribute('product-tile-thumbnail', thumbnail);
              document.querySelector(productElemId).setAttribute('product-tile-aggRating', product.averageRating);
              const prices = document.querySelectorAll('div[data-ref="dataContainer"] div.product-tile__container a.product-tile__price');
              if (prices[i * 20 + j] && prices[i * 20 + j].querySelector('span.text--pink')) {
                const downPrice = prices[i * 20 + j].querySelector('span.text--pink').textContent;
                document.querySelector(productElemId).setAttribute('product-tile-price', downPrice);
                console.log('priceDown', downPrice, i * 20 + j);
              } else if (prices[i * 20 + j] && prices[i * 20 + j].querySelector('span.text--gray-dark')) {
                const price = prices[i * 20 + j].querySelector('span.text--gray-dark').textContent;
                document.querySelector(productElemId).setAttribute('product-tile-price', price);
                console.log('priceDown', price, i * 20 + j);
              } else if (product.igcMarkDownPrice && product.igcMarkDownPrice.formattedValue) {
                document.querySelector(productElemId).setAttribute('product-tile-price', product.igcMarkDownPrice.formattedValue);
              } else if (product.price && product.price.formattedValue) document.querySelector(productElemId).setAttribute('product-tile-price', product.price.formattedValue);
            }
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
