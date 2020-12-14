const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'Conforama_fr',
    transform: transform,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('article[class="box-product    "]>form')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const name = document.querySelectorAll('article[class="box-product    "]>form');
      var image;
      // @ts-ignore
      const URL = window.tc_vars.originalPageURL;
      let price;
      for (let i = 0; i < name.length; i++) {
        image = document.querySelectorAll('div[class="image-product"] a img')[i].getAttribute('src');
        if (image.startsWith('http')) {
          addHiddenDiv('image', image, i);
        }
        else {
          image = document.querySelectorAll('div[class="image-product"] a img')[i].getAttribute('data-frz-src');
          addHiddenDiv('image', image, i);
        }
      }
      addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
  },
};