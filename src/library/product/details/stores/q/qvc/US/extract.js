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
      const addElementToDOM = (id, link, title) => {
        const element = document.createElement('a');
        element.id = id;
        element.href = link;
        element.title = title;
        element.style.display = 'none';
        document.body.appendChild(element);
      };
      const videoArray = document.querySelectorAll('div[class="videoThumb"]');
      if (videoArray.length !== 0) {
        if (videoArray.length === 1) {
          const link = document.querySelector('div[class="ssmp-container"] video').src ? document.querySelector('div[class="ssmp-container"] video').src : '';;
          const time = document.querySelector('span[class="vjs-duration-display"]').innerText ? document.querySelector('span[class="vjs-duration-display"]').innerText : '';
          addElementToDOM('videoInfo', link, time);
        }
        if (videoArray.length !== 1) {
          for (let i = 0; i < videoArray.length; i++) {
            videoArray[i].click();
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const link = document.querySelector('div[class="ssmp-container"] video').src ? document.querySelector('div[class="ssmp-container"] video').src : '';
            const time = document.querySelector('span[class="vjs-duration-display"]').innerText ? document.querySelector('span[class="vjs-duration-display"]').innerText : '';
            addElementToDOM('videoInfo', link, time);
          }
        }
      }
    });

    const dataConversion = (data, sku = null, availability = null) => {
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('ingredientsList' in data[k].group[i]) {
            for (let j = 1; j < data[k].group[i].ingredientsList.length; j++) {
              data[k].group[i].ingredientsList[0].text += ' ' + data[k].group[i].ingredientsList[j].text;
            }
            data[k].group[i].ingredientsList = data[k].group[i].ingredientsList.slice(0, 1);
          }
          if ('description' in data[k].group[i]) {
            data[k].group[i].description[0].text = data[k].group[i].description[0].text.replace(/[\r\n]+/g, ' ').replace(/\s\s+/g, ' ');
          }
          if (sku !== null && 'variantId' in data[k].group[i]) {
            data[k].group[i].variantId[0].text = sku;
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
            let direct =  data[k].group[i].directions[0].text;
            direct = direct.split('How do I use it:')[1].split('From')[0];
            data[k].group[i].directions[0].text = 'How do I use it:' + direct;
            data[k].group[i].directions[0].text = data[k].group[i].directions[0].text.trim();
          }
        }
      }
      return data;
    };

    const variants = await context.evaluate(() => { return document.querySelectorAll('ul[role="radiogroup"] li').length; });
    if (variants !== 0) {
      for (let i = 0; i < variants; i++) {
        await context.evaluate((i) => {
          document.querySelectorAll('ul[role="radiogroup"] li')[i].click();
        }, i);
        // wait for extraction
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        dataConversion(await context.extract(productDetails, { transform }), info.offers[i].sku, info.offers[i].availability);
      };
    }
    if (variants === 0) {
      dataConversion(await context.extract(productDetails, { transform }));
    }
  },
};
