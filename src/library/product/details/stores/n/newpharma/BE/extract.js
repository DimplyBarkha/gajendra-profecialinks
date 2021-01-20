
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

      function getIngredients (name) {
        const nodes = document.evaluate(`//table//td[text()="${name}"]/../td[position()>1]`, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let uom;
        let amount;
        let node = null;
        // eslint-disable-next-line no-cond-assign
        while ((node = nodes.iterateNext()) && (!uom || !amount)) {
          if (node.textContent.match(/^[\D/]+$/)) uom = node.textContent;
          else if (node.textContent.match(/^[\d/,]+$/)) amount = node.textContent;
          else if (node.textContent.match(/^(\d+(.\d+)?)\D+$/)) {
            uom = node.textContent.match(/^(\d+(.\d+)?)(\D+)$/)[3];
            amount = node.textContent.match(/^(\d+(.\d+)?)(\D+)$/)[1];
            break;
          }
        }
        return [uom, amount];
      }

      if (document.querySelector('#js-cookie-policy-popup')) {
        document.querySelector('#js-cookie-policy-popup').remove();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const data = {};
      // @ts-ignore
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
        if (color) data.color = color.match(/Couleur (.+)/) ? color.match(/Couleur (.+)/)[1].replace(':', '').trim() : '';
      }
      data.url = window.location.href;
      data.brandLink = document.querySelector('div.subtitle-brand > a')
        ? `https://www.newpharma.be${document.querySelector('div.subtitle-brand > a').getAttribute('href')}` : '';
      data.quantity = extractParagraph('Présentation', description, headersArr);
      data.directions = extractParagraph('Conseils d’utilisation', description, headersArr);
      data.warnings = extractParagraph('Précautions', description, headersArr);
      data.ingredients = extractParagraph('Ingrédients', description, headersArr);
      data.additionalDesc = extractParagraph('Propriétés', description, headersArr);
      data.manufacturerDescription = data.additionalDesc;

      if (document.querySelector('div.c-price__unit span')) {
        data.pricePer = document.querySelector('div.c-price__unit span').textContent;
        data.pricePerUnit = document.querySelector('div.c-price__unit').textContent.match((/\/\s?(.+)\)/))
          ? document.querySelector('div.c-price__unit').textContent.match((/\/\s?(.+)\)/))[1] : '';
      }
      data.availability = document.querySelector('div.js-stock_message') && document.querySelector('div.js-stock_message').textContent.toLowerCase().includes('en stock')
        ? 'In Stock' : 'Out Of Stock';
      const promotionText = document.querySelector('div.box-promo__content') ? `${document.querySelector('div.box-promo__content').textContent} ` : '';
      const priceBadgeText = document.querySelector('div.c-price__badge') ? document.querySelector('div.c-price__badge').textContent : '';
      data.promotion = `${promotionText}${priceBadgeText}`;
      const isPrivacyPolicy = !!document.evaluate('//nav/a[text()="Politique en matière de vie privée"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const isCS = !!document.evaluate('//nav/a[text()="Service client"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const isImgZoom = !!document.querySelector('div.product-details a.zoom');
      if (isPrivacyPolicy) data.privacyPolicy = 'Yes';
      if (isCS) data.cs = 'Yes';
      if (isImgZoom) data.imgZoom = 'Yes';
      [data.uomVitA, data.vitA] = getIngredients('Vitamine A');
      [data.uomVitC, data.vitC] = getIngredients('Vitamine C');
      [data.uomCalc, data.calc] = getIngredients('Calcium');
      [data.uomFibres, data.fibres] = getIngredients('Fibres alimentaires');
      [data.uomFats, data.fats] = getIngredients('Graisses');
      [data.uomProteines, data.proteines] = getIngredients('Protéines');
      [data.uomSodium, data.sodium] = getIngredients('Na');
      [data.uomCarbs, data.carbs] = getIngredients('Glucides');
      data.calories = getTextByXpath('//table//td[text()="Énergie"]/..').replace('Énergie ', '');
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
