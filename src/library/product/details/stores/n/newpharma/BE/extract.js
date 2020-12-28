
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform: cleanUp,
    domain: 'newpharma.be',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }

      function getTextByXpath (xp) {
        return document.evaluate(xp, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
      }

      function searchDescription (description, header) {
        const descriptionSplit = description.split('^');
        const match = descriptionSplit.find(el => el.includes(header));
        if (match) return match.split(header)[1];
        return '';
      }

      function extractParagraph (headerText, description, headers) {
        let result = '';
        const headerMatches = headers.filter(el => el.includes(headerText));
        for (let i = 0; i < headerMatches.length; i++) {
          const header = headerMatches[i];
          if (result) result += ' ';
          result += searchDescription(description, header).replace(/\s:/g, '').trim();
        }
        return result;
      }
      if (document.querySelector('#js-cookie-policy-popup')) {
        document.querySelector('#js-cookie-policy-popup').remove();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      const data = {};
      // @ts-ignore
      data.manufacturerDescription = [...document.querySelectorAll('div[class=text-description] > div.text-description-content')].map(el => el.innerText).join(' ');
      const descHeaders = document.querySelectorAll('div.text-description-content strong');
      const headersArr = [];
      let lastHeader;
      for (let i = 0; i < descHeaders.length; i++) {
        const header = descHeaders[i];
        if (lastHeader) header.textContent = lastHeader + header.textContent;
        if (!header.textContent.includes(':')) {
          lastHeader = header.textContent;
          header.textContent = '';
        } else {
          headersArr.push(`#${header.textContent}#`);
          header.textContent = `^#${header.textContent}#`;
          lastHeader = '';
        }
      }
      // @ts-ignore
      const description = [...document.querySelectorAll('div[class=text-description] > div.text-description-content')].map(el => el.innerText).join(' ');
      data.color = description.match(/Teinte\s?:\s?(\w+)/) ? description.match(/Teinte\s?:\s?(\w+)/)[1] : '';
      if (!data.color) {
        const color = getTextByXpath('//div[@class="text-description-content"]/div//text()[contains(.,"Couleur")]');
        if (color) data.color = data.color.match(/Couleur (.+)/)[1];
      }
      data.url = window.location.href;
      data.brandLink = document.querySelector('div.subtitle-brand > a')
        ? `https://www.newpharma.be${document.querySelector('div.subtitle-brand > a').getAttribute('href')}` : '';
      data.quantity = extractParagraph('Présentation', description, headersArr);
      data.directions = extractParagraph('Conseils d’utilisation', description, headersArr);
      data.warnings = extractParagraph('Précautions', description, headersArr);
      data.ingredients = extractParagraph('Ingrédients', description, headersArr);
      if (document.querySelector('div.c-price__unit span')) {
        data.pricePer = document.querySelector('div.c-price__unit span').textContent;
        data.pricePerUnit = document.querySelector('div.c-price__unit').textContent.match((/\/\s?(.+)\)/))
          ? document.querySelector('div.c-price__unit').textContent.match((/\/\s?(.+)\)/))[1] : '';
      }
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
