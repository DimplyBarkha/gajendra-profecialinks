
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    transform: cleanUp,
    domain: 'mytime.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('button#accept-consent-all');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });

    await context.evaluate(async function () {
      function addElementToDocument (id, value) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const isAvailable = document.querySelector('meta[property="product:availability"]');
      if (isAvailable !== null && isAvailable !== undefined) {
        addElementToDocument('isAvailable', 'In Stock');
      } else addElementToDocument('isAvailable', 'Out of Stock');

      const allergyAdvice = document.querySelectorAll('li[id="tab-ingredientsAndAllergens"] ul > li');
      const allergyText = [];
      if (allergyAdvice.length !== 0) {
        allergyAdvice.forEach((e, i) => {
          // @ts-ignore
          if (i !== 0) allergyText.push(e.innerText);
        });
        addElementToDocument('allergy', allergyText.join(' ').split('\n\n').join(' '));
      }
      // @ts-ignore
      const totalFat = [...document.querySelectorAll('tr.nutrient-table__item td, ul > li > strong')].filter(e => e.innerText === 'Fett' || e.innerText === 'Rohfett');
      if (totalFat.length === 1) addElementToDocument('totalfat', totalFat[0].nextElementSibling.innerText);
    });

    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.sodiumPerServingUom) {
        row.sodiumPerServingUom.forEach(item => {
          if (item.text.includes('/ ')) item.text = item.text.split('/ ').join('/').trim();
          if (!item.text.includes('/ ')) item.text = item.text.split(' ').pop();
        });
      }
      if (row.magnesiumPerServingUom) {
        row.magnesiumPerServingUom.forEach(item => {
          if (item.text.includes('/ ')) item.text = item.text.split('/ ').join('/').trim();
          if (!item.text.includes('/ ')) item.text = item.text.split(' ').pop();
        });
      }
      if (row.dietaryFibrePerServingUom) {
        row.dietaryFibrePerServingUom.forEach(item => {
          if (item.text.includes('/ ')) item.text = item.text.split('/ ').join('/').trim();
          if (!item.text.includes('/ ')) item.text = item.text.split(' ').pop();
        });
      }
      if (row.saltPerServingUom) {
        row.saltPerServingUom.forEach(item => {
          item.text = item.text ? item.text.split(' ').pop() : '';
        });
      }
      if (row.totalFatPerServingUom) {
        row.totalFatPerServingUom.forEach(item => {
          item.text = item.text ? item.text.split(' ').pop() : '';
        });
      }
      if (row.proteinPerServingUom) {
        row.proteinPerServingUom.forEach(item => {
          item.text = item.text ? item.text.split(' ').pop() : '';
        });
      }
      if (row.servingSizeUom) {
        row.servingSizeUom.forEach(item => {
          item.text = item.text ? item.text.split(' ').pop() : item.text;
        });
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text.replace('\n', '-')} `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.additives) {
        let text = '';
        row.additives.forEach(item => {
          text += `|| ${item.text.replace('\n', '-')} `;
        });
        row.additives = [
          {
            text: text,
          },
        ];
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = !item.text.includes('zzgl.') ? item.text.match(/.+\/\d+/) : item.text;
        });
      }
      if (row.dietaryInformation) {
        let text = '';
        row.dietaryInformation.forEach(item => {
          if (row.dietaryInformation.length > 1) {
            text += `|| ${item.text.replace('\n', '-')} `;
          } else text += item.text.replace('\n', '-');
        });

        row.dietaryInformation = [
          {
            text: text,
          },
        ];
      }
    });

    return dataRef;
  },
};
