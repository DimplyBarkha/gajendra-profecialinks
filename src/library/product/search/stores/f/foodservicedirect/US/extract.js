const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const cssPageNum = '.c-pagination__number--active';
  const cssSearchTerm = '.c-list-view-settings__list-info';
  await context.waitForSelector(cssPageNum, { timeout: 10000 });
  await context.waitForSelector(cssSearchTerm, { timeout: 10000 });

  await context.evaluate(async function () {
    function addHiddenDiv (i, productCards, productInfo) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.style.display = 'none';
      if (productInfo && productInfo[i]) {
        newDiv.dataset.productid = productInfo[i].fsd_product_reference ? productInfo[i].fsd_product_reference : '';
        newDiv.dataset.thumbnail = productInfo[i].thumbnail_image ? 'https://www.foodservicedirect.com/media/catalog/product/' + productInfo[i].thumbnail_image : '';
      }
      productCards.item(i).appendChild(newDiv);
    }

    const searchUrl = window.location.href.replace('%20', ' ');
    const hiddenSearchDiv = document.createElement('div');
    hiddenSearchDiv.id = 'search-url';
    hiddenSearchDiv.style.display = 'none';
    hiddenSearchDiv.textContent = searchUrl;
    document.body.appendChild(hiddenSearchDiv);

    async function fetchProducts (pageNum) {
      const refURL = window.location.href;

      const search = (document.querySelector('.c-list-view-settings__list-info') && document.querySelector('.c-list-view-settings__list-info').querySelectorAll('strong')[1]) ? document.querySelector('.c-list-view-settings__list-info').querySelectorAll('strong')[1].textContent : '';
      const fetchURL = `https://search.unbxd.io/ed39b885dbb44eca3c2782623eb2ba9d/www-foodservicedirect-com-805741548149387/search?q=${search}&rows=32&format=json&f.categoryPath.nameId=false&filter=product_websites:%22base%22&start=${pageNum}`;
      console.log('fetchURL: ', fetchURL);

      const response = await fetch(fetchURL, {
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

      if (response && response.status === 400) {
        throw new Error('Error when calling API');
      }

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

    const pageNum = document.querySelector('.c-pagination__number--active') ? document.querySelector('.c-pagination__number--active').textContent : '';

    function addAllHiddenDiv (productInfo) {
      const productCards = document.getElementsByClassName('p-products__list-item');
      let i = 0;
      while (i < productCards.length) {
        if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
          document.getElementById(i.toString()).remove();
        }
        addHiddenDiv(i, productCards, productInfo);
        i++;
      }
    }

    fetchProducts((parseInt(pageNum) - 1) * 32);
    console.log('Fetched data from the api call');
  });
  await context.waitForSelector(cssPageNum, { timeout: 10000 });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    transform: transform,
    domain: 'foodservicedirect.com',
  },
  implementation,
};
