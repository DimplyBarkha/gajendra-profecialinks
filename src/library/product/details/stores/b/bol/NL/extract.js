const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: cleanUp,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain },
    context,
    { productDetails }
  ) => {
    await context.evaluate(async function () {
      function addElementToDom(element, id) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }

      //autoclick
      var moreButtons = document.querySelectorAll('a.show-more__button');
      moreButtons.forEach(async (element) => {
        element.click();
      });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      // scroll to images in description
      var descpImageElem = document.querySelector('a[name="product_gallery"]');
      if (descpImageElem) {
        descpImageElem.scrollIntoView();

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      }

      // get price
      var priceElem = document.querySelector('span[class="promo-price"]');
      const regex = /\d+/gm;
      var priceOne = priceElem.childNodes[0].textContent.match(regex);
      var priceTwo = priceElem.childNodes[1].textContent.match(regex);
      let price = '';
      if (priceTwo !== null) {
        price = '€' + priceOne + ',' + priceTwo;
      } else {
        price = '€ ' + priceOne;
      }
      addElementToDom(price, 'price');
    });
    await context.extract(productDetails);
  },
};
