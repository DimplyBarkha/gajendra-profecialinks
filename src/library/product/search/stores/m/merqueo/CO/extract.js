const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    function createDiv () {
      const div = document.createElement('div');
      div.className = 'productinfo';
      document.querySelector('body').appendChild(div);
    }

    function addProp (iterator, name, value) {
      document.querySelectorAll('div.productinfo')[iterator].setAttribute(name, value);
    }

    const bodyContent = document.querySelector('body').textContent;
    const json = JSON.parse(bodyContent);

    for (let i = 0; i < json.data.length; i++) {
      createDiv();

      const name = json.data[i].attributes.name;
      const image = json.data[i].attributes.image_large_url;
      const id = json.data[i].attributes.href.match('(products.)(.*)')[2];
      const productUrl = json.data[i].attributes.href;
      const price = json.data[i].attributes.price;

      addProp(i, 'name', name);
      addProp(i, 'image', image);
      addProp(i, 'id', id);
      addProp(i, 'producturl', productUrl);
      addProp(i, 'price', String(price));
    }
  });

  return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
