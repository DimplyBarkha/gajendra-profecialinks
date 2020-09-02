const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform: cleanUp,
    domain: 'bellaffair.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const pdfPresent = document.querySelector('ul.downloads>li.pdf a')
        ? document.querySelector('ul.downloads>li.pdf a').getAttribute('href') : '';
      if (pdfPresent) {
        addElementToDocument('pdfPresent', 'Yes');
      } else addElementToDocument('pdfPresent', 'No');
      const aggregateRating = document.querySelector('meta[itemprop="ratingValue"]')
        ? document.querySelector('meta[itemprop="ratingValue"]').getAttribute('content').replace(/\./g, ',') : '';
      if (aggregateRating) addElementToDocument('aggregateRating', aggregateRating);
      const description = document.querySelector('div.description div.left')
        // @ts-ignore
        ? document.querySelector('div.description div.left').innerText.replace(/\n/g, ' ') : '';
      if (description) addElementToDocument('description', description);
      const manufacturerDescription = document.querySelector('div[itemprop="description"]')
        ? document.querySelector('div[itemprop="description"]')
          // @ts-ignore
          .innerText.replace(/\n{2,}/g, '\n') : '';
      if (manufacturerDescription) addElementToDocument('manufacturerDescription', manufacturerDescription);
      if (description) addElementToDocument('description', description);
      const shippingInfoXpath = document.evaluate('//div[@class="block third-block"][p[contains(text(),"Versandkosten")]]', document, null, XPathResult.STRING_TYPE, null);
      const shippingInfo = shippingInfoXpath ? shippingInfoXpath.stringValue.replace(/\n{2,}/g, '\n') : '';
      if (shippingInfo) addElementToDocument('shippingInfo', shippingInfo);
    });
    await context.extract(productDetails);
  },
};
