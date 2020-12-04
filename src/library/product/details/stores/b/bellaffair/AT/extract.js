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
        // add alternateImages src
        var alternativeImg = document.querySelectorAll('div[class="thumbs clear"] span:not(.active) a');
        if (alternativeImg !== null) {
          for (let i = 0; i < alternativeImg.length; i++) {
          const element = document.createElement('div');
          const parent = document.querySelector('div[class="thumbs clear"]');
          element.id = 'altImg';
          element.title = alternativeImg[i].href;
          element.style.display = 'none';
          parent.appendChild(element);
          }
        }
        // add descrBullets field
        var descBullets = document.querySelectorAll('div[class="description"] div[class="left"] li');
        if (descBullets !== null) {
          addElementToDocument ('bullets', descBullets.length);
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
    var data = await context.extract(productDetails);
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('description' in data[k].group[i] && data[k].group[i].description.length) {
          for(let j = 1; j < data[k].group[i].description.length; j++){
            data[k].group[i].description[0].text += ' ' + data[k].group[i].description[j].text;
          }
          data[k].group[i].description = data[k].group[i].description.slice(0, 1);
        }
        if ('availabilityText' in data[k].group[i]) {
          if (data[k].group[i].availabilityText[0].text !== 'Out of Stock') {
            data[k].group[i].availabilityText[0].text = 'In Stock';
          }
        }
      }
    }
    return data;
  },
};
