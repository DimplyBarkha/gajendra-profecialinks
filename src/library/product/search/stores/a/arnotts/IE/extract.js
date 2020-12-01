const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const brandUrl = await context.evaluate(async () => {
      const brandUrlArr = document.querySelectorAll('div.cat-wall-links-wrapper a');
      if (brandUrlArr) {
        for (let i = 0; i < brandUrlArr.length; i++) {
          const brandLink = brandUrlArr[i].href;
          if (brandLink.includes('shop-all-dyson')) {
            return brandLink;
          }
        }
      }
    });
    if (brandUrl) {
      await context.goto(brandUrl);
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
      const productList = document.querySelectorAll('ul#product-search-result-items li');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
