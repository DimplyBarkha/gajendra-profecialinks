const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    transform: cleanUp,
    domain: 'planethair.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {

    await context.evaluate(async () => {
      // add alternateImages src
      var alternativeImg = document.querySelectorAll('a[class*="hidden"] img');
      if (alternativeImg !== null){
        for (let i=0; i < alternativeImg.length; i++){
          const element = document.createElement('div');
          const parent = document.querySelector('div[class="ty-tygh  "]');
          element.id = 'alternateImages';
          element.title = alternativeImg[i].src;
          element.style.display = 'none';
          parent.appendChild(element);
        }
      }
    });

    await context.evaluate(async () => {
      // add descriptionBullets count
      var descBullets = document.querySelectorAll('div[id="content_description"] ul li');
      if (descBullets !== null) {
        const element = document.createElement('div');
        element.id = 'descriptionBullets';
        element.title = descBullets.length.toString();
        element.style.display = 'none';
        document.body.appendChild(element);
      }
    });
  

    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('price' in data[k].group[i]) {
          data[k].group[i].price[0].text = data[k].group[i].price[0].text.replace('.', ',');
        }
        if ('aggregateRating' in data[k].group[i]) {
          data[k].group[i].aggregateRating[0].text = data[k].group[i].aggregateRating[0].text.replace('.', ',');
        }
        if ('availabilityText' in data[k].group[i]) {
          if (data[k].group[i].availabilityText[0].text === 'Non disponibile') {
            data[k].group[i].availabilityText[0].text = 'Out of Stock';
          } else {
            data[k].group[i].availabilityText[0].text = 'In Stock';
          }
        }
        if ('description' in data[k].group[i]) {
          var descrString = data[k].group[i].description[0].text;
          descrString = descrString.split('Planethair.it:');
          descrString = descrString[0];
          descrString = descrString.split('Ingredienti');
          descrString = descrString[0];
          data[k].group[i].description[0].text = descrString;
        }
        if ('ingredientsList' in data[k].group[i]) {
          if (data[k].group[i].ingredientsList[0].text.includes('Ingredienti')) {
            var ingList = data[k].group[i].ingredientsList[0].text;
            ingList = ingList.split('Planethair.it:');
            ingList = ingList[0];
            ingList = ingList.split('Ingredienti');
            ingList = ingList[1];
            data[k].group[i].ingredientsList[0].text = ingList;
          } else {
            data[k].group[i].ingredientsList[0].text = '';
          }
        }
      }
    }
    return data;
  },
};
