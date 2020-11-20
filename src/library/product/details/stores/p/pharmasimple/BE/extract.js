const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    const title = document.querySelector('h1[itemprop="name"]')
      ? document.querySelector('h1[itemprop="name"]').textContent
      : null;
    if (title) {
      const regExp = /\d+\s?\w+/g;
      const quantity = [...title.matchAll(regExp)];

      addElementToDom(quantity.pop(), 'quantity');
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    transform: transform,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
  implementation,
};
