
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NM',
    domain: 'luluhypermarket.com',
    store: 'luluwebstore',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const categories = document.querySelectorAll('span.nav__link.js_nav__link a, ul.nav-menu-l2-items li a');
      if (categories.length) {
        for (let i = 0; i < categories.length; i++) {
          const categoryElem = categories[i];
          if (categoryElem.getAttribute('href') && categoryElem.innerText !== 'GOOD LIFE') {
            const category = document.createElement('div');
            category.id = `category${i}`;
            category.style.display = 'none';
            const categoryName = categoryElem.innerText ? categoryElem.innerText : '';
            category.setAttribute('category_name', categoryName);
            const categoryUrl = categoryElem.getAttribute('href') ? 'https://www.luluhypermarket.com' + categoryElem.getAttribute('href') : '';
            category.setAttribute('category_url', categoryUrl);
            document.body.appendChild(category);
          }
        }
      }
    });

    await context.extract(productMenu);
  },
};
