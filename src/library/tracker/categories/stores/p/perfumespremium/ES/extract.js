
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'perfumespremium.es',
    store: 'perfumespremium',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const categories = document.querySelectorAll('div.mega-content li.sm_megamenu_drop.parent >a,  a.sm_megamenu_nodrop');
      if (categories.length) {
        for (let i = 0; i < categories.length; i++) {
          const categoryElem = categories[i];
          if (categoryElem.getAttribute('href') && !categoryElem.getAttribute('href').includes('/marcas-a-z/')) {
            const category = document.createElement('div');
            category.id = `category${i}`;
            category.style.display = 'none';
            const categoryName = categoryElem.innerText ? categoryElem.innerText : '';
            category.setAttribute('category_name', categoryName);
            const categoryUrl = categoryElem.getAttribute('href') ? categoryElem.getAttribute('href') : '';
            category.setAttribute('category_url', categoryUrl);
            document.body.appendChild(category);
          }
        }
      }
    });

    await context.extract(productMenu);
  },
};
