const { transform } = require('../../../../shared');

async function implementation (
  // @ts-ignore
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { keywords, results } = inputs;
  try {
    await context.click('localization-confirmation div:nth-child(1)>button');
    await new Promise(resolve => setTimeout(resolve, 30000));
  } catch (error) {
    console.log('no localized button found');
  }
  try {
    await context.click('button#fsrFocusFirst');
  } catch (error) {
    console.log('no button found');
  }
  const response1 = await context.evaluate(async function ({ keywords }) {
    if (keywords) {
      return await fetch(`https://www.homedepot.ca/api/search/v1/search?q=${keywords}&store=7077&page=1&pageSize=100&lang=en`)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }
  }, { keywords });
  await new Promise(resolve => setTimeout(resolve, 20000));
  let response2 = {};
  if (response1 && response1.searchReport && response1.searchReport.totalProducts > 100) {
    response2 = await context.evaluate(async function ({ keywords }) {
      if (keywords) {
        return await fetch(`https://www.homedepot.ca/api/search/v1/search?q=${keywords}&store=7077&page=2&pageSize=100&lang=en`)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
      }
    }, { keywords });
  }
  await new Promise(resolve => setTimeout(resolve, 20000));
  let response = [];
  if (response1 && response1.products && response2 && response2.products) {
    response = [...response1.products, ...response2.products];
  } else {
    if (response1 && response1.products) {
      response = response1.products;
    }
  }
  if (response) {
    const products = response;
    await context.evaluate(async function ({ products, keywords, results }) {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addDataToDocument (key, value, mainNode) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.getElementById(mainNode).appendChild(catElement);
      }
      const l = products.length;
      let page = 1;
      for (let index = 0; index < l; index++) {
        if (index > 39 && index <= 79) {
          page = 2;
        }
        if (index > 79 && index <= 119) {
          page = 3;
        }
        if (index > 119) {
          page = 4;
        }
        if (results && index === Number(results)) {
          break;
        }
        const rowId = `pd_div_${index}`;
        const element = products[index];
        if (!document.querySelector(rowId)) {
          addElementToDocument(`pd_div_${index}`, index);
        }
        // @ts-ignore
        if (keywords && page) {
          // @ts-ignore
          const searchUrl = `https://www.homedepot.ca/api/search/v1/search?q=${keywords}&store=7077&page=${page}&pageSize=40&lang=en`;
          addDataToDocument('search-url', searchUrl, rowId);
        }
        element.code && addDataToDocument('id', element.code, rowId);
        element.url && addDataToDocument('pd_url', element.url, rowId);
        element.pricing && element.pricing.displayPrice && element.pricing.displayPrice.formattedValue && addDataToDocument('pd_price', element.pricing.displayPrice.formattedValue, rowId);
        element.brand && element.name ? addDataToDocument('pd_name', `${element.brand} ${element.name}`, rowId) : element.name && addDataToDocument('pd_name', `${element.name}`, rowId);
        element.imageUrl && addDataToDocument('pd_thumbnail', element.imageUrl, rowId);
        element.brand && addDataToDocument('pd_brand', element.brand, rowId);
        element.productRating && element.productRating.averageRating && addDataToDocument('pd_aggregateRating', element.productRating.averageRating, rowId);
        element.productRating && element.productRating.totalReviews && addDataToDocument('pd_rating', element.productRating.totalReviews, rowId);
        element.modelNumber && addDataToDocument('pd_mpc', element.modelNumber, rowId);
      }
    }, { products, keywords, results });
  }
  await new Promise(resolve => setTimeout(resolve, 30000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation,
};
