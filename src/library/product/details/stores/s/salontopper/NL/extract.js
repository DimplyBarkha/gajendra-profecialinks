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
      const directionsTitle = document.querySelectorAll('div[id*="accordion"] > *')
        ? document.querySelectorAll('div[id*="accordion"] > *') : [];
      directionsTitle.forEach((e, i) => {
        if (e.textContent.includes('Gebruiksaanwijzing')) {
          directions.push(e.textContent);
          const main = e.nextElementSibling
            ? e.nextElementSibling.textContent : '';
          directions.push(main);
        }
        if (e.textContent.includes('Gebruik:') && !e.textContent.includes('Resultaat na gebruik')) {
          const directionsMain = e.parentElement
            ? e.parentElement.textContent : '';
          directions.push(directionsMain.split('Gebruik:').pop().trim());
        }
        if (e.textContent.includes('Gebruik') && !e.textContent.includes('Gebruik:') && !e.textContent.includes('Resultaat na gebruik')) {
          const directionsMain = e.textContent.split('Gebruik').pop()
            ? e.parentElement.textContent : '';
          directions.push('Gebruik'.concat(directionsMain.split('Gebruik:').pop()));
        }
      });

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
      const ratingValue = document.querySelector('meta[itemprop="ratingValue"]');
      if (ratingValue !== null) ratingValue.setAttribute('ratingvalue', ratingValue.getAttribute('content').replace('.', ','));
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
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = !item.text.includes('.') || !item.text.includes(',') ? item.text.concat(',0') : item.text;
          if (item.text === '0,0') item.text = item.text.split(',').shift();
        });
      }
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
