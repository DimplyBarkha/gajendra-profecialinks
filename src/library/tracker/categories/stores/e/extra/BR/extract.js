
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'extra.com.br',
    store: 'extra',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const products = document.querySelectorAll('nav.header-navigation ul.dropdown-menu li a');
      for (let i = 0; i < products.length; i++) {
        if (products[i].innerText && products[i].innerTerxt.toLowerCase() !== 'serviços' && products[i].innerTerxt.toLowerCase() !== 'lojas parceiras') {
          const category = document.createElement('div');
          category.id = `category${i}`;
          category.style.display = 'none';
          const categoryName = products[i].innerText ? products[i].innerText : '';
          category.setAttribute('category_name', categoryName);
          const categoryUrl = products[i].getAttribute('href') ? products[i].getAttribute('href') : '';
          category.setAttribute('category_url', categoryUrl);
        }
      }
    });

    await context.extract(productMenu);
  },
};
