const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    transform,
    domain: 'ebag.bg',
    zipcode: '',
  },
  implementation: async ({ results }, { country, domain, transform }, context, { productDetails }) => {
    async function paginate (results = 150) {
      let scrollSelector = document.querySelector('footer[class="page-footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        const length = document.querySelectorAll('article[class*="item"]').length;
        if (Number(length) >= Number(results)) {
          break;
        }
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class="page-footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }

    async function addUrl (results = 150) {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      const productCode = {};
      // @ts-ignore
      const { products } = window.SearchManager;
      for (const product of products) {
        productCode[product.id] = product.product_code;
      }
      console.log('productCode', productCode);
      const productList = document.querySelectorAll('article.item');
      for (let index = 0; index < productList.length; index++) {
        if (index === Number(results)) {
          break;
        }
        const element = productList[index];
        element.setAttribute('class', 'item fetched');
      }
      productList && productList.forEach((item1) => {
        const id = item1.querySelector('h2 a') ? item1.querySelector('h2 a').getAttribute('href')
          ? item1.querySelector('h2 a').getAttribute('href').replace(/.*\/(.*)/, '$1') : '' : '';
        const doc = item1;
        addElementToDocument(doc, 'added-searchurl', searchUrl);
        addElementToDocument(doc, 'added-productId', productCode[id] ? productCode[id] : '');
      });
    }
    try {
      await context.waitForSelector('#search-product-list div.see-all-button-container > button[class*="see-all"]');
      await context.click('#search-product-list div.see-all-button-container > button[class*="see-all"]');
    } catch (error) {
      console.log('see all button not present!!');
    }
    await context.evaluate(paginate, results);
    try {
      await context.waitForSelector('a[class=img-container]');
    } catch (error) {
      console.log('All images not loaded after scrolling!!');
    }

    await context.evaluate(addUrl, results);
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
