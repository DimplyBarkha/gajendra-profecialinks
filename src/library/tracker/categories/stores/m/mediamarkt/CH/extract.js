
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CH',
    domain: 'mediamarkt.ch',
    store: 'mediamarkt',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('li[data-identifier=category-tree-navigation] div[class*=panel] a[class*=site-navigation][href]');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] && categories[i].textContent.trim() ? categories[i].textContent.trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryUrl = categories[i] ? categories[i].getAttribute('href').replace(/^\/\/www/g, 'https://www').replace(/^\//g, 'https://www.mediamarkt.ch/') : '';
        categories[i].setAttribute('categoryUrl', categoryUrl);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};

