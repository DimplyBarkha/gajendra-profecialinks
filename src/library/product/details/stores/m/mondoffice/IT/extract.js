const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function getElement (key, value) {
        const ref = [...document.querySelectorAll(key)];
        const color = ref.find(el => el.innerHTML.includes(value)).innerHTML;
        const getColor = color.replace(value, '');
        return getColor.replace(':', '');
      }
      addElementToDocument('additional_desc_bullet_count', document.querySelectorAll('.description-sku__figure-text > ul > li').length);
      addElementToDocument('secondary_image-total', document.querySelectorAll('#customize-thumbnails > div').length);
      try {
        const color = getElement('.description-sku__figure-text > ul > li', 'Colore');
        if (color) addElementToDocument('colour', color);
      } catch (e) {
        console.log(e);
      }
      try {
        const material = getElement('.product-sku__details > ul > li', 'Materiale');
        if (material) addElementToDocument('materials', material);
      } catch (e) {
        console.log(e);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
