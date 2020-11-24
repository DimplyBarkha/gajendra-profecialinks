const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    transform,
    domain: 'pnp.co.za',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      async function extractAndFormatPrice (selector) {
        const array = [];
        const priceNode = document.querySelector(selector);
        if (priceNode && priceNode.childNodes.length > 1) {
          const priceChildNodes = priceNode.childNodes;
          for (let i = 0; i < priceChildNodes.length; i++) {
            array.push(priceChildNodes[i].textContent.trim());
          }
          return array.join('.').replace(',', '').match(/(\d+\.?\d+)/)[1];
        }
        return null;
      }
      const productDiv = document.createElement('div');
      productDiv.className = 'extra-info';
      document.body.appendChild(productDiv);
      const oldPrice = await extractAndFormatPrice('div.oldprice');
      const promotion = await extractAndFormatPrice('div.savings');
      let rating = document.querySelector('div.rating.js-ratingCalc').getAttribute('data-rating');
      if (/"\d\.?\d?"/.test(rating)) {
        rating = rating.match(/"(\d\.?\d?)"/)[1].replace('.', ',');
      } else {
        rating = '0';
      }
      const scriptElement = document.evaluate('//script[contains(text(),"/* Initialise dataLayer */")]', document, null, XPathResult.STRING_TYPE, null);
      const fixedJson = scriptElement.stringValue.match(/dataLayer = \[([\s\S]*)];/)[1].replace(/"/, '\\"').replace(/'/g, '"').replace(/userId,/g, '"userId",');
      const productObj = JSON.parse(fixedJson);
      const { productCode, productPrice, productQuantity, productName, CategoryOfProduct } = productObj;
      productDiv.setAttribute('id', productCode);
      productDiv.textContent = productPrice.replace('.', ',');
      productDiv.setAttribute('quantity', productQuantity);
      productDiv.setAttribute('name', productName);
      productDiv.setAttribute('category', CategoryOfProduct);
      productDiv.setAttribute('rating', rating);
      if (oldPrice) {
        productDiv.setAttribute('old-price', oldPrice.replace('.', ','));
      }
      if (promotion) {
        productDiv.setAttribute('promotion', `SAVE ${promotion.replace('.', ',')}`);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
