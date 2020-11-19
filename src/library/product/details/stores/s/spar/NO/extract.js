const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    transform: cleanUp,
    domain: 'spar.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const brandXpath = '//li[@class="ws-manufacturer-info__item"][strong[contains(.,"Merke")]]/text()[2]';
      const brandElem = document.evaluate(brandXpath, document, null, XPathResult.STRING_TYPE, null);
      const brandName = brandElem ? brandElem.stringValue : '';
      const productName = document.querySelector('h1[itemprop="name"]') ? document.querySelector('h1[itemprop="name"]').innerText : '';
      if (!productName.match(brandName)) {
        addElementToDocument('nameExtended', `${brandName} ${productName}`);
      } else addElementToDocument('nameExtended', productName);

      const size = document.querySelector('p.cw-product__variant') ? document.querySelector('p.cw-product__variant').innerText : '';
      const unit = document.querySelector('p.cw-product__price-unit') ? document.querySelector('p.cw-product__price-unit').innerText.replace(/^.*\/(.*)$/g, '$1') : '';
      const re = new RegExp(`^.*\\s(\\d+(\\.?,?\\d+)?\\s?${unit}).*$`, 'g');
      if (unit.length && size.match(unit)) addElementToDocument('size', size.replace(re, '$1'));
      const addToCartBtn = document.querySelector('div.cw-product__details button.ws-add-to-cart__button--add') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', addToCartBtn);

      const description1 = document.querySelector('div.cw-product__details div[itemprop="additionalProperty"] p.cw-product__variant')
        ? document.querySelector('div.cw-product__details div[itemprop="additionalProperty"] p.cw-product__variant').innerText : '';
      const description2 = document.querySelectorAll('ul.ws-manufacturer-info>li');
      if ((description2 && description2.length) || description1) {
        const bulletsArr = [description1];
        description2.forEach(e => bulletsArr.push(e.textContent));
        const concatDesc = bulletsArr.join(' || ');
        addElementToDocument('description', concatDesc);
      };
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.extract(productDetails, { transform });
  },
};
