
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'GR',
    domain: 'e-fresh.gr',
    store: 'e-fresh',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('a.dropdown-toggle, li.buttons.text-center, li.buttons a[class*=hidden], ul.level-3 a');
      for (let i = 0; i < categories.length; i++) {
        const categoryHref = categories[i].getAttribute('href');
        const categoryDataHref = categories[i].getAttribute('data-href');
        if (categoryHref) {
          categories[i].setAttribute('categoryUrl', categoryHref.replace(/^\//g, 'https://www.e-fresh.gr/'));
        } else if (categoryDataHref) {
          categories[i].setAttribute('categoryUrl', categoryDataHref.replace(/^\//g, 'https://www.e-fresh.gr/'));
        };
        console.log(categories[i].getAttribute('categoryUrl'));
        const categoryNameFromUrl = categories[i].getAttribute('categoryUrl') && categories[i].getAttribute('categoryUrl').match(/[^/]*$/g) ? categories[i].getAttribute('categoryUrl').match(/[^/]*$/g)[0] : '';
        const categoryName = categories[i] && categories[i].textContent ? categories[i].textContent.trim() : categoryNameFromUrl;
        categories[i].setAttribute('categoryName', categoryName);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
