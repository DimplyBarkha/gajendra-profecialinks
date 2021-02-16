const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    transform: cleanUp,
    domain: 'metro.zakaz.ua',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, text) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = text;
        document.body.appendChild(div);
      }
      // if (document.querySelector('.big-product-card__add-to-cart-btn').innerText === 'Добавить в корзину') {
      //   addHiddenDiv('stock', 'In Stock');
      //   //document.querySelector('.main').setAttribute('stock', 'In Stock');
      // } else {
      //   addHiddenDiv('stock', 'Out of Stock');
      //   //document.querySelector('.main').setAttribute('stock', 'Out of Stock');
      // }
      const btn = document.querySelector('.jsx-3209444046');
      if (btn) {
        btn.click();
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
