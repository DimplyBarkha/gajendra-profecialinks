const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    transform,
    domain: 'americanas.com.br',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      };
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const addElementToDocument = (elem, id, value) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = value;
        newDiv.style.display = 'none';
        elem.appendChild(newDiv);
      };
      // products available on the site
      const allProducts = document.querySelectorAll('div[class*=StyledGrid] div[class*=GridItem]');
      // @ts-ignore
      const allProductsObj = window.__PRELOADED_STATE__.products;
      const searchUrl = window.location.href;

      for (let i = 0; i < allProducts.length; i++) {
        const productElem = allProducts[i];
        // productId taken from DOM selector
        const productId = productElem.querySelector('a') ? productElem.querySelector('a').href.replace(/.*\/produto\/([^?]*)?.*$/g, '$1') : '';
        const productObj = allProductsObj[productId];
        if (productId && productObj) {
          const aggRating = productObj.rating && productObj.rating.average ? productObj.rating.average : '';
          addElementToDocument(productElem, 'aggregateRating', aggRating);
          const img = productObj.images && productObj.images[0] ? productObj.images[0].extraLarge : null;
          addElementToDocument(productElem, 'added_img', img);
          if (!img) {
            const imgFromDOM = productElem.querySelector('picture[class*="src__Picture"] img') ? productElem.querySelector('picture[class*="src__Picture"] img').getAttribute('src') : '';
            addElementToDocument(productElem, 'added_img', imgFromDOM);
          }
          addElementToDocument(productElem, 'searchUrl', searchUrl);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
