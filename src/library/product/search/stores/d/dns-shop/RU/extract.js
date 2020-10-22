const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('footer[class="main-footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class="main-footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('div[class=product-info] picture img');
    } catch (error) {
      console.log('All images not loaded after scrolling!!');
    }

    await context.evaluate(async () => {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('div.catalog-item');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
