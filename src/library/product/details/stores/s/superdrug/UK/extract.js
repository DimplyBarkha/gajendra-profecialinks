const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    // get nameExtended with dash 'brand - product_name'
    const name = document.querySelector('h1.pdp__productName') ? document.querySelector('h1.pdp__productName').innerText : null;
    const brand = document.querySelector('span.pdp__byBrand>a') ? document.querySelector('span.pdp__byBrand>a').innerText : null;
    if (name !== null && brand !== null) {
      // @ts-ignore
      addElementToDocument('nameextended', `${brand} - ${name}`);
    }

    const prefix = 'https://www.superdrug.com';
    const brandName = document.querySelector('span.pdp__byBrand>a') ? document.querySelector('span.pdp__byBrand>a').getAttribute('href') : null;
    if (brandName !== null) {
      const brandLink = brandName.replace(/\s/g, '%20');
      // @ts-ignore
      addElementToDocument('brandlink', `${prefix}${brandLink}`);
    }

    const isImgZoom = document.querySelector('div.pdp-gallery__large-img')
      ? document.querySelector('div.pdp-gallery__large-img') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }
    // @ts-ignore
    const variants = [...document.querySelectorAll('*[id=addToCartForm] div > a')].map(el => {
      return `${el.innerText} - ${el.getAttribute('href').match(/(\d+)$/)[0]}`;
    });
    variants.forEach((variant, index) => {
      addElementToDocument(`added-variant-${index}`, variant);
    });
    const terms = document.evaluate('//a[contains(@class,"footer")][text()="Terms & Conditions"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    const privacy = document.evaluate('//a[contains(@class,"footer")][text()="Privacy Policy"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    const customerService = document.evaluate('//h4[contains(@class,"footer")][text()="Customer Service"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (terms) addElementToDocument('added-terms', 'Yes');
    if (privacy) addElementToDocument('added-privacy', 'Yes');
    if (customerService) addElementToDocument('added-customer-service', 'Yes');
    // @ts-ignore
    const secondaryImages = [...document.querySelectorAll('#thumbnails img')].map(el => 'https://www.superdrug.com' + el.getAttribute('src')).slice(1);
    if (secondaryImages.length) {
      addElementToDocument('added-total-sec-img', secondaryImages.length);
      secondaryImages.forEach((img, index) => {
        addElementToDocument(`added-sec-img-${index}`, img);
      });
    }
    const pricePerUnit = document.evaluate('//p[contains(@class,"pricing__per-item")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (pricePerUnit && pricePerUnit.match(/per\s?(.+)/)) addElementToDocument('added-price-uom', pricePerUnit.match(/per\s?(.+)/)[1]);
    const availability = document.querySelector('span[itemprop=availability]') ? document.querySelector('span[itemprop=availability]').textContent : '';
    addElementToDocument('added-availability', availability === 'inStock' ? 'In Stock' : 'Out Of Stock');
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: cleanUp,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation,
};
