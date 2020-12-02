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
  try {
    await context.click('localization-confirmation div:nth-child(1)>button');
    await new Promise(resolve => setTimeout(resolve, 30000));
  } catch (error) {
    console.log('no localized button found');
  }
  try {
    await context.clickAndWaitForNavigation('.hdca-cms-content-banner__content-box .hdca-button-container a', {}, { timeout: 30000 });
  } catch (error) {
    console.log('no banner container found');
  }
  const response = await context.evaluate(async function () {
    const searchTerm = window.location.href.replace(/(.*)q=(.*):relevance(.*)/, '$2');
    const pageLink = window.location.href.match(/(.*)&page=(\d+)/) && window.location.href.replace(/(.*)&page=(\d+)/, '$2');
    const page = pageLink ? parseInt(pageLink) : 1;
    // @ts-ignore
    const pageCheck = document.querySelector('acl-pagination > div > nav > div > ul > li:last-child') && document.querySelector('acl-pagination > div > nav > div > ul > li:last-child').innerText;
    const pageCount = pageCheck ? parseInt(pageCheck) : 1;
    // @ts-ignore
    const scriptsDiv = document.querySelectorAll('script[type="text/javascript"]');
    // @ts-ignore
    const scriptDiv = Array.from(scriptsDiv, ele => ele.innerText);
    const categoryString = scriptDiv.filter(element => element.match(/(.*) 'pagetype': 'CATEGORY', 'categoryid': '(.*)' (.*)/));
    const categoryId = categoryString && categoryString[0] && categoryString[0].match(/(.*) 'categoryid': '(.*)' (.*)/) && categoryString[0].replace(/(.*) 'categoryid': '(.*)' (.*)/, '$2');
    console.log('category id', categoryId, 'page Link', pageLink, 'page', page, 'page check', pageCount);
    if (page && pageCount && page <= pageCount) {
      if (categoryId) {
        return await fetch(`https://www.homedepot.ca/api/search/v1/search?category=${categoryId}&store=7011&page=${page}&pageSize=40&lang=en`)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
      } else {
      // @ts-ignore
        if (searchTerm) {
          return await fetch(`https://www.homedepot.ca/homedepotcacommercewebservices/v2/homedepotca/search?q=${searchTerm}:relevance&store=7011&page=${page}&pageSize=40&lang=en`)
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
        }
      }
    }
  });
  if (response && response.products) {
    const products = response.products;
    await context.evaluate(async function (products) {
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
      for (let index = 0; index < l; index++) {
        const rowId = `pd_div_${index}`;
        const element = products[index];
        if (element.brand) {
          if (!document.querySelector(rowId)) {
            addElementToDocument(`pd_div_${index}`, index);
          }
          const searchTerm = window.location.href.match(/(.*)(q|searchterm)=(.*):relevance(.*)/) ? window.location.href.replace(/(.*)(q|searchterm)=(.*):relevance(.*)/, '$3') : window.location.href.replace(/(.*)searchterm=(.*)&(.*)/, '$2');
          const pageLink = window.location.href.match(/(.*)&page=(\d+)/) && window.location.href.replace(/(.*)&page=(\d+)/, '$2');
          const page = pageLink ? parseInt(pageLink) : 1;
          // @ts-ignore
          if (searchTerm && page) {
          // @ts-ignore
            const searchUrl = `https://www.homedepot.ca/homedepotcacommercewebservices/v2/homedepotca/search?q=${searchTerm}:relevance&page=${page}&pageSize=40&lang=en`;
            !document.querySelector('div[id*="search-url"]') && addElementToDocument('search-url', searchUrl);
          } else {
            // @ts-ignore
            const searchTerm1 = document.querySelector('h1 span.acl-display--show') && document.querySelector('h1 span.acl-display--show').innerText;
            if (searchTerm1 && page) {
              const searchUrl1 = `https://www.homedepot.ca/homedepotcacommercewebservices/v2/homedepotca/search?q=${searchTerm}:relevance&page=${page}&pageSize=40&lang=en`;
              !document.querySelector('div[id*="search-url"]') && addElementToDocument('search-url', searchUrl1);
            }
          }
          element.code && addDataToDocument('id', element.code, rowId);
          element.url && addDataToDocument('pd_url', element.url, rowId);
          element.pricing && element.pricing.displayPrice && element.pricing.displayPrice.formattedValue && addDataToDocument('pd_price', element.pricing.displayPrice.formattedValue, rowId);
          element.brand && element.name && addDataToDocument('pd_name', `${element.brand} ${element.name}`, rowId);
          element.imageUrl && addDataToDocument('pd_thumbnail', element.imageUrl, rowId);
          element.brand && addDataToDocument('pd_brand', element.brand, rowId);
          element.productRating && element.productRating.averageRating && addDataToDocument('pd_aggregateRating', element.productRating.averageRating, rowId);
          element.productRating && element.productRating.totalReviews && addDataToDocument('pd_rating', element.productRating.totalReviews, rowId);
          element.modelNumber && addDataToDocument('pd_mpc', element.modelNumber, rowId);
        }
      }
    }, products);
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
