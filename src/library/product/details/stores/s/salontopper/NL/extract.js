// @ts-nocheck
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    transform: cleanUp,
    domain: 'salontopper.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // directions
      const directions = [];
      const dirText = document.querySelectorAll('div[id*="accordion"] > *')
        ? document.querySelectorAll('div[id*="accordion"] > *') : [];
      // first paragraph contains directions
      const firstP = [...dirText]
        .filter(e => e.innerText.includes('Gebruik ') && !e.parentElement.innerText.includes('Gebruiksaanwijzing') && !e.previousElementSibling.innerText.includes('Resultaat') && !e.innerText.includes('Gebruik:'))
        .pop();
      if (firstP !== undefined && firstP.length !== 0) directions.push('Gebruik'.concat(firstP.innerText.split('Gebruik').pop()));
      // second paragraph contains directions
      const secondP = [...dirText].filter(e => e.innerText.includes('Gebruiksaanwijzing') && !e.innerText.includes('Gebruiksaanwijzing:'));
      if (secondP !== undefined && secondP.length !== 0) {
        secondP.forEach(e => {
          if (e.nextElementSibling !== null) {
            directions.push(e.innerText);
            directions.push(e.nextElementSibling.innerText);
          } else {
            directions.push('Gebruiksaanwijzing '.concat(e.innerText.split('Gebruiksaanwijzing').pop().trim()));
          }
        });
      }
      // third paragraph contains directions
      const thirdP = [...dirText].filter(e => e.innerText.includes('Gebruik:')).pop();
      if (thirdP !== undefined && thirdP.length !== 0) {
        directions.push(thirdP.innerText.split('Gebruik:').pop().trim());
      }
      // fourth paragraph contains directions
      const fourthP = [...dirText].filter(e => e.innerText.includes('Gebruiksaanwijzing:')).pop();
      if (fourthP !== undefined && fourthP.length !== 0) {
        directions.push('Gebruiksaanwijzing: '.concat(fourthP.innerText.split('Gebruiksaanwijzing:').pop().trim()));
      }
      addElementToDocument('directions', directions.join(' '));
      // description bullets
      const desc = [];
      const header = document.querySelector('#description > a')
        ? document.querySelector('#description > a').textContent : '';
      const title = document.querySelector('div[itemprop="description"] h2')
        ? document.querySelector('div[itemprop="description"] h2').textContent : '';
      const main = document.querySelectorAll('div[itemprop="description"] > *:not([name]):not(h2)')
        ? [...document.querySelectorAll('div[itemprop="description"] > *:not([name]):not(h2)')].map(e => e.innerText).join('').split('\n').join('')
        : '';
      desc.push(header);
      desc.push(title);
      desc.push(main);
      const specs = document.querySelector('#specs')
        ? document.querySelector('#specs').innerText.split('\n').join(' | ') : '';
      desc.push(specs);
      addElementToDocument('desc', desc.join(''));
      // rating
      const ratingValue = document.querySelector('meta[itemprop="ratingValue"]')
        ? document.querySelector('meta[itemprop="ratingValue"]').getAttribute('content') : null;
      if (ratingValue !== null && ratingValue.includes('.')) addElementToDocument('ratingvalue', ratingValue.replace('.', ','));
      if (ratingValue !== null && !ratingValue.includes('.')) addElementToDocument('ratingvalue', ratingValue);

      // video url
      const ytPrefix = 'https://www.youtube-nocookie.com/embed/';
      const keyword = document.querySelector('a[class*="thumb youtube"]')
        ? document.querySelector('a[class*="thumb youtube"]').getAttribute('style').match(/vi\/(.*)\//)[1] : null;
      if (keyword !== null) addElementToDocument('videoUrl', ytPrefix.concat(keyword));

      // alternateImages
      const prefix = 'https://www.salontopper.nl';
      const alternateImages = document.querySelectorAll('a[class*="thumb"]:not(:first-child) img')
        ? document.querySelectorAll('a[class*="thumb"]:not(:first-child) img') : null;
      if (alternateImages !== null) alternateImages.forEach(e => addElementToDocument('alternateImages', prefix.concat(e.getAttribute('src'))));

      // brandLink
      const brandLink = document.querySelector('div.accordion-content li a[href*="/merken/"]')
        ? document.querySelector('div.accordion-content li a[href*="/merken/"]') : null;
      if (brandLink !== null) addElementToDocument('brandLink', prefix.concat(brandLink.getAttribute('href')));

      // adding availability
      const isAvailable = document.querySelector('meta[itemprop*="availability"][content*="InStock"]')
        ? document.querySelector('meta[itemprop*="availability"][content*="InStock"]').getAttribute('content') : null;
      if (isAvailable !== null) {
        addElementToDocument('isAvailable', 'In Stock');
      } else addElementToDocument('isAvailable', 'Out Of Stock');
      const sku = document.querySelector('meta[itemprop="mpn"]')
        ? document.querySelector('meta[itemprop="mpn"]').getAttribute('content') : '';
      const variantInformation = document.querySelector('select[class="autoredirect"] > option[selected="selected"]');
      if (variantInformation !== null) variantInformation.setAttribute('variantinfo', variantInformation.textContent.split('variant: ').join('').trim().concat(` - ${sku}`));
    });
    var dataRef = await context.extract(productDetails, { transform });
    dataRef[0].group.forEach((row) => {
      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text = item.text ? item.text.trim() : '';
        });
      }
      if (row.variants) {
        row.variants.forEach(item => {
          item.text = item.text.includes('variant') ? item.text.split('variant: ').join('') : item.text;
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.includes('variant') ? item.text.split('variant: ').join('').trim() : item.text.trim();
        });
      }
    });

    return dataRef;
  },

};
