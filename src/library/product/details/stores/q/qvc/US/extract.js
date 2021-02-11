const { cleanUp } = require('./shared');
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
    // add video, description bullet-info count information
    await context.evaluate(async function () {
      const addElementToDOM = (tag, id, content) => {
        const element = document.createElement(tag);
        if (tag === 'a') {
          element.id = id;
          element.href = content.split('//')[1];
        };
        if (tag === 'div') {
          element.id = id;
          element.textContent = content;
        }
        element.style.display = 'none';
        document.body.appendChild(element);
      };
      const videoInfo = document.querySelector('script[id="mediaJSON"]') ? JSON.parse(document.querySelector('script[id="mediaJSON"]').textContent) : '';
      if (videoInfo.video !== undefined && videoInfo.video.length !== 0) {
        for (let i = 0; i < videoInfo.video.length; i++) {
          if (videoInfo.video[i].encodings[i] !== undefined) {
            addElementToDOM('a', 'videoInfo', videoInfo.video[i].encodings[0].url);
          }
        }
      }
      const bulletInfo = document.querySelectorAll('div[class="accordionText"] ul li').length;
      addElementToDOM('div', 'descriptionBullets', bulletInfo);
      const description = document.querySelector('div[class="accordionText"]');
      const descriptionLiElements = document.querySelectorAll('div[class="accordionText"] ul li');
      if (document.querySelector('div[class="accordionText"] div')) {
        document.querySelector('div[class="accordionText"] div').remove();
      }
      if (document.querySelector('div[class="accordionText"] div[class="tuneIn"]')) {
        document.querySelector('div[class="accordionText"] div[class="tuneIn"]').remove();
      }
      let descriptionText = description ? description.textContent : '';
      const descriptionLiTexts = [];
      descriptionLiElements.forEach((li) => {
        descriptionLiTexts.push(li.textContent ? li.textContent : '');
      });
      const descriptionBulletsText = descriptionLiTexts.length ? ' || ' + descriptionLiTexts.join(' || ') : '';
      descriptionText += descriptionBulletsText;
      addElementToDOM('div', 'description', descriptionText);
    });

    const dataConversion = (data, sku = null, availability = null, variantInfo = null, price = null) => {
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('image' in data[k].group[i]) {
            data[k].group[i].image[0].text = 'https:' + data[k].group[i].image[0].text;
          }
          if ('alternateImages' in data[k].group[i]) {
            for (let j = 0; j < data[k].group[i].alternateImages.length; j++) {
              data[k].group[i].alternateImages[j].text = 'https:' + data[k].group[i].alternateImages[j].text;
            }
          }
          if ('ingredientsList' in data[k].group[i]) {
            for (let j = 1; j < data[k].group[i].ingredientsList.length; j++) {
              data[k].group[i].ingredientsList[0].text += ' ' + data[k].group[i].ingredientsList[j].text;
            }
            data[k].group[i].ingredientsList = data[k].group[i].ingredientsList.slice(0, 1);
          }
          if (sku !== null && 'variantId' in data[k].group[i]) {
            data[k].group[i].variantId[0].text = sku;
          }
          if (variantInfo !== null && 'variantInformation' in data[k].group[i]) {
            data[k].group[i].variantInformation[0].text = variantInfo;
          }
          if (price !== null && 'price' in data[k].group[i]) {
            data[k].group[i].price[0].text = '$' + price;
          }
          if ('aggregateRating' in data[k].group[i] && !data[k].group[i].aggregateRating[0].text.includes('.')) {
            data[k].group[i].aggregateRating[0].text += '.0';
          }
          if (availability !== null && 'availabilityText' in data[k].group[i]) {
            if (availability === 'OutofStock') {
              data[k].group[i].availabilityText[0].text = 'Out Of Stock';
            }
            if (availability !== 'OutofStock') {
              data[k].group[i].availabilityText[0].text = 'In Stock';
            }
          }
          if ('directions' in data[k].group[i]) {
            if (data[k].group[i].directions[0].text.includes('How do I use it:')) {
              data[k].group[i].directions[0].text = 'How do I use it: ' + data[k].group[i].directions[0].text.split('How do I use it:')[1].split('From')[0].trim();
            } else {
              data[k].group[i].directions[0].text = '';
            }
          }
        }
      }
      return data;
    };

    const colorVariants = await context.evaluate(() => { return document.querySelectorAll('ul[aria-label="Color"] li').length; });
    const sizeVariants = await context.evaluate(() => { return document.querySelectorAll('ul[aria-label="Size"] li').length; });
    if (colorVariants !== 0 && sizeVariants === 0) {
      const colorVariantAvailability = await context.evaluate(() => {
        const colorVariantAvailability = [];
        document.querySelectorAll('ul[aria-label="Color"] li').forEach((element) => {
          colorVariantAvailability.push(element.getAttribute('ats'));
        });
        return colorVariantAvailability;
      });
      const variantInfo = await context.evaluate(() => {
        const variantInfo = [];
        document.querySelectorAll('ul[aria-label="Color"] li').forEach((element) => {
          variantInfo.push(element.dataset.originalTitle);
        });
        return variantInfo;
      });
      for (let i = 0; i < colorVariants; i++) {
        await context.evaluate((i) => {
          document.querySelectorAll('ul[aria-label="Color"] li')[i].click();
        }, i);
        // wait for extraction
        if (colorVariantAvailability[i] !== 'N') {
          await new Promise((resolve, reject) => setTimeout(resolve, 500));
          dataConversion(await context.extract(productDetails, { transform }), info.offers[i].sku, info.offers[i].availability, variantInfo[i], info.offers[i].price);
        }
      };
    }
    if (colorVariants !== 0 && sizeVariants !== 0) {
      let dataId = 0;
      const variantInfo = await context.evaluate(() => {
        const variantInfo = [];
        for (let i = 0; i < document.querySelectorAll('ul[aria-label="Color"] li').length; i++) {
          const color = document.querySelectorAll('ul[aria-label="Color"] li')[i].dataset.originalTitle;
          for (let j = 0; j < document.querySelectorAll('ul[aria-label="Size"] li').length; j++) {
            const size = document.querySelectorAll('ul[aria-label="Size"] li')[j].dataset.originalTitle;
            variantInfo.push(color + ' ' + size);
          }
        }
        return variantInfo;
      });
      for (let i = 0; i < colorVariants; i++) {
        await context.evaluate((i) => {
          document.querySelectorAll('ul[aria-label="Color"] li')[i].click();
        }, i);
        // wait for extraction
        for (let j = 0; j < sizeVariants; j++) {
          await context.evaluate((j) => {
            document.querySelectorAll('ul[aria-label="Size"] li')[j].click();
          }, j);
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          dataConversion(await context.extract(productDetails, { transform }), info.offers[dataId].sku, info.offers[dataId].availability,variantInfo[dataId], info.offers[dataId].price);
          dataId++;
        }
      };
    }
    if (colorVariants === 0) {
      dataConversion(await context.extract(productDetails, { transform }), null, null, null, info.offers[0].price);
    }
  },
};
