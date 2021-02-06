
// eslint-disable-next-line no-unused-vars
const { cleanUp } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: cleanUp,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return Boolean(document.querySelector(currentSelector));
      }, selector);
    };

    const url = await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.location.href;
      }
    });
    // extracting video
    const iframeSelector = 'div[class*="video-inner"] iframe';

    if (await checkExistance(iframeSelector)) {
      const iframeUrl = await context.evaluate((iframeSelector) => {
        return document.querySelector(iframeSelector).getAttribute('src');
      }, iframeSelector);
      await context.goto(iframeUrl);
      await context.waitForXPath('//link[@rel="canonical"][contains(@href, "youtube")]');
      const video = await context.evaluate(() => {
        const src = ele('link[rel="canonical"][href*="youtube"]');
        function ele (tag) {
          return document.querySelectorAll(tag);
        }
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].getAttribute('href'));
          }
        }
        return value;
      });

      await context.goto(url);
      await context.evaluate((video) => {
        video = video.join(' | ');
        document.querySelector('body').setAttribute('video-src', video);
      }, video);
    }

    await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });

    await context.evaluate(async function () {
      function addElementToDocument (key, value, src) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.setAttribute('src', src);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // mpc
      // @ts-ignore
      const mpcs = [...document.querySelectorAll('script[type="text/javascript"]')].filter(e => e.innerText.includes('ManufacturerId') && e.innerText.includes('dataLayer'));
      const mpc = [];
      if (mpcs.length !== 0) {
        mpcs.forEach(e => {
          if (e.innerText.match(/ManufacturerId":"(\d+)/) !== null) mpc.push(e.innerText.match(/ManufacturerId":"(\d+)/)[1]);
        });
      }
      addElementToDocument('mpc', mpc[0]);
      // upc
      const upc = document.querySelector('span[itemprop="gtin13"]')
        // @ts-ignore
        ? document.querySelector('span[itemprop="gtin13"]').innerText : '';
      addElementToDocument('upc', upc);
      // adding name extended
      const name = document.querySelector('div[class*="prdct__designation"] h1[class="prdct__maintitle"]');
      const variantInfo = document.querySelector('div[class*="prdct__sku-selected"] span[class="prdct__sku-name"], span[class*="prdct__bullets-link active"]');
      if (name !== null) {
        if (variantInfo !== null) { addElementToDocument('nameextended', name.textContent.trim().concat(` ${variantInfo.textContent.trim()}`)); } else addElementToDocument('nameextended', name.textContent.trim());
      }
      // adding size
      const quantity = document.querySelector('div#description strong');
      if (quantity !== null && quantity !== undefined) {
        // @ts-ignore
        const quantityText = quantity.innerText.match(/\d+ml|\d+ ml|\d+g|\d+ g|\d+ Cl|\d+ML/);
        if (quantityText !== null) addElementToDocument('quantity', quantityText[0]);
      }
      // adding description and bullets
      const hiddenSpan = document.querySelector('div#description span.hidden')
      // @ts-ignore
        ? document.querySelector('div#description span.hidden').innerText : '';

      const descriptionText = document.querySelector('div#description')
        // @ts-ignore
        ? document.querySelector('div#description').innerText : '';
      // @ts-ignore
      addElementToDocument('desc', descriptionText.split('\n').join(' ').concat(hiddenSpan));
      let count = 0;
      const benefits = document.querySelector('div.prdct__details-benefits > p');
      // @ts-ignore
      if (benefits !== null && benefits.innerText !== undefined) {
        // @ts-ignore
        [...benefits.innerText.split('\n')].filter(e => e.length > 0).forEach(e => {
          if ((e.charAt('-', 0) === '-') || (e.charAt('•', 0) === '•')) count++;
        });
        addElementToDocument('bullet', count);
      }

      // adding description and bullets when product is unavailable
      const hiddenDesc = document.querySelector('div#savoirplus')
        // @ts-ignore
        ? document.querySelector('div#savoirplus').innerText : '';

      let countHidden = 0;
      if (document.querySelector('div#description') === null && hiddenDesc !== undefined && hiddenDesc !== null) {
        // @ts-ignore
        addElementToDocument('descHidden', hiddenDesc.split('\n').join(' ').concat(hiddenSpan));
        const text = hiddenDesc.split('\n').filter(e => e.length > 0);
        if (text.length > 1 && text[0] !== null && text[0] !== undefined) {
          text.forEach(e => {
            if ((e.charAt('-', 0) === '-') || (e.charAt('•', 0) === '•')) countHidden++;
          });
        } if (text.length === 1 && text[0] !== null && text[0] !== undefined) {
          if (text[0].includes('•')) {
            const bullets = text[0].replace(/•/g, ' ||').match(/\|\|/gi);
            countHidden += bullets.length;
          }
        }
        addElementToDocument('bulletHidden', countHidden);
      }
    });

    await context.evaluate(async function () {
      const openDirections = document.querySelector('a[href="#conseils"]');
      // @ts-ignore
      if (openDirections) {
        // @ts-ignore
        openDirections.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 500));
        const directions = document.querySelector('div#conseils');
        // @ts-ignore
        if (directions !== undefined && directions !== null) openDirections.setAttribute('directions', directions.innerText.split('\n').join(' '));
      }
    });

    await context.evaluate(async function () {
      const openIngredients = document.querySelector('a[href="#ingredients"]');
      // @ts-ignore
      if (openIngredients !== undefined && openIngredients !== null) openIngredients.click();
    });

    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text ? item.text.split('Bénéfice produit').join(' En savoir plus Bénéfice produit ').split('Réf').join(' Réf') : '';
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.includes('\n') ? item.text.split('\n').join('').trim() : '';
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = item.text ? item.text.split('/').shift().trim().split('€').join(' €') : '';
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach(item => {
          item.text = item.text ? item.text.split('/').pop().trim() : '';
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text ? item.text.split('|').shift().trim() : '';
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          item.text = item.text ? item.text.split('|').shift().trim() : '';
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = !item.text.includes('nocibe.fr') ? 'https://www.nocibe.fr'.concat(item.text) : item.text;
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          item.text = item.text ? 'https://www.youtube.com/embed/'.concat(item.text.split('=').pop()) : '';
        });
      }

      // if (row.sku) {
      //   row.sku.forEach(item => {
      //     item.text = item.text ? item.text.replace(/^0+/, '') : '';
      //   });
      // }

      if (row.variantCount) {
        row.variantCount.forEach(item => {
          item.text = item.text === '1' ? '0' : item.text;
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          if (item.text.includes('avis ')) {
            item.text = item.text ? item.text.substring(item.text.lastIndexOf('sur') + 4, item.text.lastIndexOf('avis')) : '';
          } item.text = item.text ? item.text.match(/\d+/gm)[0] : '';
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          if (item.text.includes('.')) {
            item.text = item.text.replace('.', ',');
          }
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.includes('src')) {
            item.text = item.text ? item.text.substring(item.text.lastIndexOf('https'), item.text.lastIndexOf('onload') - 2) : '';
          }
          if (!item.text.includes('https')) {
            item.text = item.text ? 'https://www.nocibe.fr'.concat(item.text) : '';
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.includes('src')) {
            item.text = item.text ? item.text.substring(item.text.lastIndexOf('https'), item.text.lastIndexOf('onload') - 2) : '';
          }
          if (!item.text.includes('https')) {
            item.text = item.text ? 'https://www.nocibe.fr'.concat(item.text) : '';
          }
        });
      }
    });

    return dataRef;
  },
};
