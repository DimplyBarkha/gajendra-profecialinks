
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'vikingdirect.fr',
    store: 'vikingdirect',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('a.megaMenuTab, a[class*="atLink"], a[class*="seeAll"], a.fmmBrandShopsText');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] ? categories[i].textContent.trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryHref = categories[i] ? categories[i].getAttribute('href') : '';
        const categoryUrl = categoryHref ? categoryHref.replace(/^\//g, 'https://www.vikingdirect.fr/') : '';
        categories[i].setAttribute('categoryUrl', categoryUrl);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
