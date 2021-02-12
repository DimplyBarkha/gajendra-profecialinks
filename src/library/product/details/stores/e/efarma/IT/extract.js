const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'efarma',
    transform: cleanUp,
    domain: 'efarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const reviewCount = document.querySelector('span[class="mp-count animated-inline"] em') ? document.querySelector('span[class="mp-count animated-inline"] em').textContent : '';
      if (reviewCount === '') {
        return null;
      }
      if (reviewCount !== '' && reviewCount === '(1)') {
        document.body.setAttribute('review_count', reviewCount.match(/\d+/)[0]);
        let rating = document.querySelector('div[class="mp-review-rating"]') ? document.querySelector('div[class="mp-review-rating"]').getAttribute('ng-style') : '0';
        rating = (parseInt(rating.match(/\d+/)[0]) * 5 / 100).toString() + '.0';
        document.body.setAttribute('rating', rating);
      }
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('description' in data[k].group[i]) {
          for (let j = 1; j < data[k].group[i].description.length; j++) {
            const descrText = data[k].group[i].description[j].text;
            if (descrText.includes('Modalità d’uso') | descrText.includes('Avvertenze') | descrText.includes('Ingredienti')) {
              data[k].group[i].description[j].text = '';
              data[k].group[i].description[j + 1].text = '';
            }
            data[k].group[i].description[0].text += ' ' + data[k].group[i].description[j].text;
          }
          data[k].group[i].description = data[k].group[i].description.slice(0, 1);
        }
        if ('totalFatPerServing' in data[k].group[i]) {
          data[k].group[i].totalFatPerServing[0].text = data[k].group[i].totalFatPerServing[0].text.match(/\d+,\d+/g)[0];
        }
        if ('totalFatPerServingUom' in data[k].group[i]) {
          data[k].group[i].totalFatPerServingUom[0].text = data[k].group[i].totalFatPerServingUom[0].text.match(/[a-z]+/g)[0];
        }
        if ('saturatedFatPerServing' in data[k].group[i]) {
          data[k].group[i].saturatedFatPerServing[0].text = data[k].group[i].saturatedFatPerServing[0].text.match(/\d+,\d+/g)[1];
        }
        if ('saturatedFatPerServingUom' in data[k].group[i]) {
          data[k].group[i].saturatedFatPerServingUom[0].text = data[k].group[i].saturatedFatPerServingUom[0].text.match(/[a-z]+/g)[1];
        }
        if ('totalSugarsPerServing' in data[k].group[i]) {
          data[k].group[i].totalSugarsPerServing[0].text = data[k].group[i].totalSugarsPerServing[0].text.match(/\d+,\d+/g)[1];
        }
        if ('totalSugarsPerServingUom' in data[k].group[i]) {
          data[k].group[i].totalSugarsPerServingUom[0].text = data[k].group[i].totalSugarsPerServingUom[0].text.match(/[a-z]+/g)[1];
        }
      }
    }
    return data;
  },
};
