const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    let brandUrl;
    brandUrl = await context.evaluate(async () => {
      if (document.querySelector('a.area-categories-nav-item__link')) {
        const brandUrl = document.querySelector('a.area-categories-nav-item__link').href;
        return brandUrl;
      }
    });
    if (brandUrl) {
      await context.goto(brandUrl);
      await context.waitForXPath("//div[@class='product-list-container']//section[@class='product-card']");
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
      const productList = document.querySelectorAll('div.product-list-container section.product-card');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
