const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'metcash_drakes',
    transform: cleanUp,
    domain: 'drakes.com.au',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom (element, id) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.querySelector('body').appendChild(div);
      }

      const variantID = window.location.href.replace('https://074.drakes.com.au/lines/', '');
      addElementToDom(variantID, 'variantID');

      const discountedPrice = document.querySelector('.MoreInfo__Header .MoreInfo__Banner__Price .MoreInfo__Price')
        ? document.querySelector('.MoreInfo__Header .MoreInfo__Banner__Price .MoreInfo__Price').innerText
        : '';
      addElementToDom(discountedPrice, 'discountedPrice');

      const discount = document.querySelector('.MoreInfo__Body .MoreInfo__Tags .saving-amount')
        ? document.querySelector('.MoreInfo__Body .MoreInfo__Tags .saving-amount').innerText
        : '';

      if (discount) {
        addElementToDom(discount, 'discount');
        const discountNumber = parseFloat(discount.replace(/.*[$]/g, ''));
        const discountedPriceNumber = parseFloat(discountedPrice.replace(/.*[$]/g, ''));
        const listedPrice = `$${(discountNumber + discountedPriceNumber).toFixed(2)}`;
        addElementToDom(listedPrice, 'listedPrice');
      }

      const details = document.querySelector('.MoreInfo__Details') ? document.querySelector('.MoreInfo__Details').innerText : '';
      addElementToDom(details, 'description');

      const imageDetails = document.querySelector('.MoreInfo__Cool') ? document.querySelector('.MoreInfo__Cool').innerText : '';
      addElementToDom(imageDetails, 'description');

      let quantity = document.querySelector('.MoreInfo__Banner .MoreInfo__Banner__Controls div.qi')
        ? document.querySelector('.MoreInfo__Banner .MoreInfo__Banner__Controls div.qi').getAttribute('data-quantity-input')
        : '';
      if (quantity) {
        const json = JSON.parse(quantity);
        quantity = json.default;
        addElementToDom(quantity, 'quantity');
      }

      const weightPrice = document.querySelector('.MoreInfo__Banner__Price .MoreInfo__PriceUnit')
        ? document.querySelector('.MoreInfo__Banner__Price .MoreInfo__PriceUnit').innerText
        : '';
      const regexWeight = /(\d*)(\w+)/g;
      if (weightPrice.includes('per')) {
        addElementToDom(weightPrice, 'servingSize');
        const weightNet = weightPrice.replace('per ', '');
        if (regexWeight.test(weightNet)) {
          const units = weightNet.replace(/(\d*)/g, '');
          addElementToDom(units, 'units');
          addElementToDom(weightNet, 'weightNet');
        }
      } else {
        const name = document.querySelector('.MoreInfo__Banner__Name') ? document.querySelector('.MoreInfo__Banner__Name').innerText : '';
        const weightNet = name.slice(name.lastIndexOf(' ') + 1, name.length);
        if (regexWeight.test(weightNet)) {
          const units = weightNet.replace(/(\d*)/g, '');
          addElementToDom(units, 'units');
          addElementToDom(`per ${weightNet}`, 'servingSize');
          addElementToDom(weightNet, 'weightNet');
        }
      }

      const listOfHeaders = document.querySelector('.MoreInfo__Details h2') ? document.querySelectorAll('.MoreInfo__Details h2') : [];
      listOfHeaders.forEach((header, index) => {
        if (header.innerText.toLowerCase().includes('ingredients')) {
          const listOfIngredients = document.querySelector(`.MoreInfo__Details h2:nth-of-type(${index + 1}) ~ p`)
            ? document.querySelectorAll(`.MoreInfo__Details h2:nth-of-type(${index + 1}) ~ p`)
            : [];

          listOfIngredients.forEach((ingredient) => {
            addElementToDom(ingredient.innerText, 'ingredient');
          });
        }
      });

      const pricePerUnit = document.querySelector('.MoreInfo__Banner__Price .MoreInfo__UnitPricing')
        ? document.querySelector('.MoreInfo__Banner__Price .MoreInfo__UnitPricing').innerText.replace('(', '').replace(')', '')
        : '';
      addElementToDom(pricePerUnit, 'pricePerUnit');
      const pricePerUnitUnit = pricePerUnit.match(/per (\d*)?([a-z]*)/)[2];
      addElementToDom(pricePerUnitUnit, 'pricePerUnitUnit');
    });
    await context.extract(productDetails);
  },
};
