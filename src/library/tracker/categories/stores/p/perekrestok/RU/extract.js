
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'RU',
    domain: 'vprok.ru',
    store: 'perekrestok',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('*[class*=fo-catalog-menu] a');
      for (let i = 0; i < categories.length; i++) {
        const categoryNameFromImg = categories[i] && !categories[i].textContent.trim() && categories[i].querySelector('img') ? categories[i].querySelector('img').getAttribute('alt') : '';
        const categoryName = categories[i] && categories[i].textContent.trim() ? categories[i].textContent.trim() : categoryNameFromImg;
        categories[i].setAttribute('categoryName', categoryName);
        const categoryHref = categories[i] ? categories[i].getAttribute('href').replace('https://www.vprok.ru', '') : '';
        const categoryUrl = categoryHref && categoryHref.match('http') ? categoryHref : `https://www.perekrestok.ru${categoryHref}`;
        categories[i].setAttribute('categoryUrl', categoryUrl);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
