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
    // add video information
    await context.evaluate(async function () {
      const addElementToDOM = (link, length) => {
        const element = document.createElement('a');
          const parent = document.querySelector('div[class="photoWrapper"]');
          element.id = 'videoInfo';
          element.href = link;
          element.title = length; 
          element.style.display = 'none';
          parent.appendChild(element);
      };
      const videoArray = document.querySelectorAll('div[class="videoThumb"]');
      if (videoArray.length !== 0){
        if (videoArray.length === 1) {
          videoArray[0].click();
          await new Promise((resolve) => setTimeout(resolve, 4000));
          let link = document.querySelector('div[class="ssmp-container"] video').src;
          let length = document.querySelector('span[class="vjs-duration-display"]').innerText;
          addElementToDOM(link, length);
        }
        if (videoArray.length !== 1) {
          for (let i = 1; i < videoArray.length; i++) {
            videoArray[i].click();
            await new Promise((resolve) => setTimeout(resolve, 4000));
            let link = document.querySelector('div[class="ssmp-container"] video').src;
            let length = document.querySelector('span[class="vjs-duration-display"]').innerText;
            addElementToDOM(link, length);
          }
        }
      } 
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('availabilityText' in data[k].group[i]) {
          if (data[k].group[i].availabilityText[0].text.includes('In Stock')) {
            data[k].group[i].availabilityText[0].text = 'In Stock';
          }
          if (data[k].group[i].availabilityText[0].text.includes('not available')) {
            data[k].group[i].availabilityText[0].text = 'Out of Stock';
          }
        }
        if('ingredientsList' in data[k].group[i]) {
          for (let j = 1; j < data[k].group[i].ingredientsList.length; j++) {
            data[k].group[i].ingredientsList[0].text += data[k].group[i].ingredientsList[j].text;
          }
          data[k].group[i].ingredientsList = data[k].group[i].ingredientsList.slice(0, 1);
        }
      }
    }
    return data;
  },
};
