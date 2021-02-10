const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'monoprix',
    transform,
    domain: 'monoprix.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, {
    country,
    domain,
    transform,
  }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addProp (selector, iterator, propName, value) {
        document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
      }

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const currentUrl = window.location.href;
      const searchUrlRegex = /\/(product)\/([^?]+)(.*)/g;
      const searchUrl = currentUrl.replace(searchUrlRegex, '/$2/$2$3');
      addElementToDocument('search_url', searchUrl);

      let allProductsCount = document.querySelectorAll('div.grocery-item-item').length;
      let pageLoader = document.querySelector('div[class*="catalog-page__loader"]')
        ? document.querySelector('div[class*="catalog-page__loader"]') : '';
      while (pageLoader && allProductsCount < 150) {
        allProductsCount = document.querySelectorAll('div.grocery-item-item').length;
        pageLoader = document.querySelector('div[class*="catalog-page__loader"]')
          ? document.querySelector('div[class*="catalog-page__loader"]') : '';
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      }

      const productUrl = document.querySelectorAll('div[class*=\'item__description-offre\']>a');
      if (productUrl.length) {
        const productBrand = document.querySelectorAll('div[class*=\'item-brand\']');
        const productTitle = document.querySelectorAll('div[class*=\'item-range\']');
        for (let i = 0; i < productUrl.length; i++) {
          productUrl[i].focus();
          await new Promise((resolve, reject) => setTimeout(resolve, 300));
          addProp('div[class*=\'item__description-offre\']>a', i, 'product_url', productUrl[i].href);
          addProp('div[class*=\'item-brand\']', i, 'product_title', productBrand[i].textContent +
            ' ' + productTitle[i].innerText);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
