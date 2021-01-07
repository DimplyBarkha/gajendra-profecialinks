const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    transform: cleanUp,
    domain: 'qvc.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    // open ingredients tab
    await context.evaluate(async function () {
      const buttonIngredients = document.querySelector('div[class*="accIngredients"] a[role="button"]');
      if (buttonIngredients) buttonIngredients.click();
    });
    const info = await context.evaluate(async function () {
      const info = document.querySelector('div[class="hidden"] script[type="application/ld+json"]') ? JSON.parse(document.querySelector('div[class="hidden"] script[type="application/ld+json"]').textContent) : '';
      return info;
    });
    // add video information
    await context.evaluate(async function () {
      const addElementToDOM = (id, link) => {
        const element = document.createElement('a');
        element.id = id;
        element.href = link;
        element.style.display = 'none';
        document.body.appendChild(element);
      };
      const videoInfo = document.querySelector('script[id="mediaJSON"]') ? JSON.parse(document.querySelector('script[id="mediaJSON"]').textContent) : '';
      if (videoInfo.video !== undefined && videoInfo.video.length !== 0) {
        for (let i = 0; i < videoInfo.video.length; i++) {
          if (videoInfo.video[i].encodings[i] !== undefined){
            addElementToDOM('videoInfo', videoInfo.video[i].encodings[0].url);
          }
        }
      }
    });

    const dataConversion = (data, sku = null, availability = null, variantInfo = null) => {
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('ingredientsList' in data[k].group[i]) {
            for (let j = 1; j < data[k].group[i].ingredientsList.length; j++) {
              data[k].group[i].ingredientsList[0].text += ' ' + data[k].group[i].ingredientsList[j].text;
            }
            data[k].group[i].ingredientsList = data[k].group[i].ingredientsList.slice(0, 1);
          }
          if ('description' in data[k].group[i]) {
            if (data[k].group[i].directions[0].text.includes('How do I use it:')){
              data[k].group[i].description[0].text = data[k].group[i].description[0].text.split('How do I use it:')[0].trim();
            }
            data[k].group[i].description[0].text = data[k].group[i].description[0].text.replace(/[\r\n]+/g, ' ').replace(/\s\s+/g, ' ');
          }
          if (sku !== null && 'variantId' in data[k].group[i]) {
            data[k].group[i].variantId[0].text = sku;
          }
          if (variantInfo !== null && 'variantInformation' in data[k].group[i]) {
            data[k].group[i].variantInformation[0].text = variantInfo;
          }
          if (availability !== null && 'availabilityText' in data[k].group[i]) {
            if (availability === 'OutofStock') {
              data[k].group[i].availabilityText[0].text = 'Out Of Stock';
            }
            if (availability === 'InStock') {
              data[k].group[i].availabilityText[0].text = 'In Stock';
            }
          }
          if ('directions' in data[k].group[i]) {
            if (data[k].group[i].directions[0].text.includes('How do I use it:')){
              data[k].group[i].directions[0].text = 'How do I use it: ' + data[k].group[i].directions[0].text.split('How do I use it:')[1].split('From')[0].trim();
            }
          }
        }
      }
      return data;
    };

    const variants = await context.evaluate(() => { return document.querySelectorAll('ul[role="radiogroup"] li').length; });
    const variantInfo = await context.evaluate(() => {
      let variantInfo = [];
      for (let i = 0; i < document.querySelectorAll('ul[role="radiogroup"] li').length; i++) {
        variantInfo.push(document.querySelectorAll('ul[role="radiogroup"] li')[i].dataset.originalTitle)
      } 
      return variantInfo;
    });
    if (variants !== 0) {
      for (let i = 0; i < variants; i++) {
        await context.evaluate((i) => {
          document.querySelectorAll('ul[role="radiogroup"] li')[i].click();
        }, i);
        // wait for extraction
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        dataConversion(await context.extract(productDetails, { transform }), info.offers[i].sku, info.offers[i].availability, variantInfo[i]);
      };
    }
    if (variants === 0) {
      dataConversion(await context.extract(productDetails, { transform }));
    }
  },
};
