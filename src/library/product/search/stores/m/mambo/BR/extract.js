const { transform } = require('./format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.querySelector('body').appendChild(div);
    }

    const text = document.querySelector('body').innerText;
    const jsonText = JSON.parse(text);

    jsonText.products.forEach((product) => {
      const id = product.id;
      const name = product.name;
      const productUrl = product.url;
      const thumbnail = product.images.default.trim().replace(/ /g, '%20');
      const price = `R$ ${product.price}`;

      addElementToDom(id, 'id');
      addElementToDom(name, 'name');
      addElementToDom(productUrl, 'productUrl');
      addElementToDom(thumbnail, 'thumbnail');
      addElementToDom(price, 'price');
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'mambo',
    transform,
    domain: 'mambo.com.br',
    zipcode: '',
  },
  implementation,
};
