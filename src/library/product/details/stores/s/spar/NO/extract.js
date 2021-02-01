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

      const brandXpath = "(//li[@class='ws-manufacturer-info__item'][strong[contains(.,'Merke')]] | //li[@class='ws-manufacturer-info__item'][strong[contains(.,'Brand')]])[1]";
      const brand = document.evaluate(brandXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        ? document.evaluate(brandXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.replace(/^[^:]+:\s?/g, '') : '';
      const nameXpath = "//h1[@itemprop='name']";
      const name = document.evaluate(nameXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        ? document.evaluate(nameXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent : '';
      if (name.match(brand)) addElementToDocument('nameExtended', name);
      else if (name && brand) addElementToDocument('nameExtended', `${brand}-${name}`);
      const addToCartBtn = document.querySelector('div.cw-product__details button.ws-add-to-cart__button--add') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', addToCartBtn);

      const description1 = document.querySelector('div.cw-product__details div[itemprop="additionalProperty"] p.cw-product__variant')
        ? document.querySelector('div.cw-product__details div[itemprop="additionalProperty"] p.cw-product__variant').textContent : '';
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
