
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PT',
    domain: 'lojashampoo.pt',
    store: 'lojashampoo',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const catXpath = '//ul[contains(@class,"navbar-nav")]//li[contains(@class,"nav-item") and not(contains(@class, "hidden-lg"))]//a[@class="dropdown-item"]|//ul[contains(@class,"navbar-nav")]//li[contains(@class,"nav-item") and not(contains(@class, "hidden-lg"))]/a';
      const categories = document.evaluate(catXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (categories.snapshotLength) {
        for (let i = 0; i < categories.snapshotLength; i++) {
          const categoryElem = categories.snapshotItem(i);
          if (categoryElem.getAttribute('href') && categoryElem.getAttribute('href') !== '#') {
            const category = document.createElement('div');
            category.id = `category${i}`;
            category.style.display = 'none';
            const categoryName = categoryElem.innerText ? categoryElem.innerText : '';
            category.setAttribute('category_name', categoryName);
            const categoryUrl = categoryElem.getAttribute('href') ? 'https://www.lojashampoo.pt' + categoryElem.getAttribute('href') : '';
            category.setAttribute('category_url', categoryUrl);
            document.body.appendChild(category);
          }
        }
      }
    });

    await context.extract(productMenu);
  },
};
