

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'drogariasaopaulo.com.br',
    store: 'drogariasaopaulo',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('ul.rnk-spacer li a, ul.rnk-best-category li a, ul.rnk-list-category li.rnk-n3 a, ul.rnk-best-brands-desktop li a');
      for (let i = 0; i < categories.length; i++) {
        const categoryHref = categories[i].getAttribute('href');
        const categoryDataHref = categories[i].getAttribute('data-href');
        if (categoryHref) {
          categories[i].setAttribute('categoryUrl', categoryHref.replace(/^\//g, 'https://www.drogariasaopaulo.com.br/'));
        } else if (categoryDataHref) {
          categories[i].setAttribute('categoryUrl', categoryDataHref.replace(/^\//g, 'https://www.drogariasaopaulo.com.br/'));
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
