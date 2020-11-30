/* eslint-disable camelcase */
const { transform } = require('../transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails, Helpers } = dependencies;
  const { transform } = parameters;
  // eslint-disable-next-line no-unused-vars
  const helpers = new Helpers(context);
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML =
          value.reduce((acc, val) => {
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
    }
    let specs = '';
    document.querySelectorAll('div.spec-set__item>span').forEach((element) => {
      let spec__label = element.querySelector('.spec__label');
      spec__label = spec__label ? spec__label.innerText.trim() : '';
      let spec__value = element.querySelector('.spec__data');
      spec__value = spec__value ? spec__value.innerText.trim() : '';
      if (spec__label) {
        specs = specs
          ? `${specs} || ${spec__label}${spec__value ? `: ${spec__value}` : ''}`
          : `${spec__label}${spec__value ? `: ${spec__value}` : ''}`;
      }
    });
    addElementToDocument('added_specs', specs);

    let aplusImages;
    if (document.querySelector('div[class*="promos__list"] img')) {
      aplusImages = document.querySelectorAll('div[class*="promos__list"] img');
      aplusImages.forEach(img => {
        addElementToDocument('added_aplus', img.getAttribute('src'));
      });
    } else if (document.querySelector('div.tiles div.hero__media img')) {
      aplusImages = document.querySelectorAll('div.tiles div.hero__media img');
      aplusImages.forEach(img => {
        addElementToDocument('added_aplus', img.getAttribute('src'));
      });
    }

    // @ts-ignore
    if (window.dataLayer) {
      // @ts-ignore
      const dataObj = window.dataLayer.find(
        (el) => el.event === 'primaryProduct',
      );
      if (dataObj && dataObj.primaryProduct) {
        addElementToDocument('added_sku', dataObj.primaryProduct.productSKU);
      }
    }
  });
  // first check that the page is a valid product page
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    transform,
    domain: 'dyson.co.il',
    zipcode: '',
  },
  implementation,
};
