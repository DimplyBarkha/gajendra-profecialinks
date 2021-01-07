const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // const el = document.querySelector('.ui-pdp-stock-information__title').innerText;
      // if (el === 'Stock disponible') addElementToDocument('isStock', 'In Stock');
      // else addElementToDocument('isStock', 'Out of Stock');
      // addElementToDocument('url', location.href);

      const el = document.querySelector('div.ui-pdp-container__col.col-1.ui-pdp-container--column-right.mt-16.pr-16 > div.ui-pdp-container__row.ui-pdp-component-list.pr-16.pl-16 > div > div.ui-pdp-container__row.ui-pdp-container__row--main-actions > form > div > button.andes-button.andes-button--quiet > span');
      const alternativeEl = document.querySelector('div > div.ui-pdp-container__row.ui-pdp-container__row--main-actions > form > div > button > span');
      const isNotAvalible = document.querySelector('div.ui-pdp-container__row.ui-pdp-container__row--item-status-short-description-message > div');
      console.log(el);
      if (isNotAvalible) {
        addElementToDocument('isStock', 'Out of Stock');
      } else if (el) {
        const innerText = el.innerText;
        if (innerText === 'Agregar al carrito') {
          addElementToDocument('isStock', 'In Stock');
        }
        console.log(innerText);
      } else if (alternativeEl) {
        const innerText2 = alternativeEl.innerText;
        if (innerText2 === 'Agregar al carrito') {
          addElementToDocument('isStock', 'In Stock');
          console.log(innerText2);
        }
      } else {
        addElementToDocument('isStock', '');
        console.log('not in stock');
      }
      // addElementToDocument('url', location.href);
    });
    return await context.extract(productDetails, { transform });
  },
};
