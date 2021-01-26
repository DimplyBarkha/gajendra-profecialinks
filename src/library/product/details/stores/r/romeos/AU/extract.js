const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    transform: cleanUp,
    domain: 'martinplace.romeosonline.com.au',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const addElementToDom = (element, id) => {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.querySelector('body').appendChild(div);
      };

      const discountedPrice = document.querySelector('.MoreInfo__Header .MoreInfo__Banner__Price .MoreInfo__Price')
        ? document.querySelector('.MoreInfo__Header .MoreInfo__Banner__Price .MoreInfo__Price').textContent
        : '';

      const discount = document.querySelector('.MoreInfo__Tags .saving-amount') ? document.querySelector('.MoreInfo__Tags .saving-amount').textContent : '';

      if (discount) {
        addElementToDom(discount, 'discount');
        let discountNumber = parseFloat(discount.replace(/.*[$]/g, ''));
        // eslint-disable-next-line no-irregular-whitespace
        if (!discountNumber && discount.match(/Save[  ](\d+)c/i)) {
          // eslint-disable-next-line no-irregular-whitespace
          discountNumber = parseFloat(discount.match(/Save[  ](\d+)c/i)[1]) / 100;
        }
        const discountedPriceNumber = parseFloat(discountedPrice.replace(/.*[$]/g, ''));
        const listedPrice = `$${(discountNumber + discountedPriceNumber).toFixed(2)}`;
        addElementToDom(listedPrice, 'listedPrice');
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

      const url = window.location.href;
      const sku = url.match(/.+\/(.+)/) ? url.match(/.+\/(.+)/)[1] : '';
      addElementToDom(sku, 'sku');
      addElementToDom(url, 'product_url');

      const productDescription = document.querySelector('div.MoreInfo__Details') ? document.querySelector('div.MoreInfo__Details').textContent.trim() : '';
      const productDisclaimer = document.querySelector('div.MoreInfo__Disclaimer') ? document.querySelector('div.MoreInfo__Disclaimer').textContent.trim() : '';
      const description = productDescription ? `${productDescription} | ${productDisclaimer}` : productDisclaimer;

      addElementToDom(description, 'description');
    });
    await context.extract(productDetails, { transform });
  },
};
