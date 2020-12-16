
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'primor.eu',
    store: 'primor',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const baner = document.querySelector('a.cont-banner-fullpage__close-button');
      if (baner) baner.click();
    });
    await context.waitForSelector('i.fa.fa-bars');
    await context.click('i.fa.fa-bars');
    await context.waitForSelector('li#manufacturers_li ul#manufacturers_list');
    await context.evaluate(async function () {
      const brandsListButton = document.querySelector('li#manufacturers_li span.menu-mobile-grover');
      if (brandsListButton) brandsListButton.click();
    });
    await context.evaluate(async function () {
      const categories = document.evaluate('//div[@id="block_top_menu"]//div[@class="row"]/ul[not(contains(@class, "quick-links"))]//li/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (categories.snapshotLength) {
        for (let i = 0; i < categories.snapshotLength; i++) {
          const categoryElem = categories.snapshotItem(i);
          if (categoryElem.getAttribute('href')) {
            const category = document.createElement('div');
            category.id = `category${i}`;
            category.style.display = 'none';
            const categoryName = categoryElem.innerText ? categoryElem.innerText : '';
            category.setAttribute('category_name', categoryName);
            const categoryUrl = categoryElem.getAttribute('href') ? categoryElem.getAttribute('href').replace(/(^\/)/, 'https://www.primor.eu/') : '';
            category.setAttribute('category_url', categoryUrl);
            document.body.appendChild(category);
          }
        }
      }
    });

    await context.extract(productMenu);
  },
};
