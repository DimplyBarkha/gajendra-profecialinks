
// eslint-disable-next-line no-unused-vars
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    transform: null,
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
      } else addElementToDocument('isAvailable', 'Out Of Stock');

      const allergyAdvice = document.querySelectorAll('li[id="tab-ingredientsAndAllergens"] ul > li');
      const allergyText = [];
      if (allergyAdvice.length !== 0) {
        allergyAdvice.forEach((e, i) => {
          // @ts-ignore
          if (i !== 0) allergyText.push(e.innerText);
        });
        addElementToDocument('allergy', allergyText.join(' ').split('\n\n').join(' '));
      }
      const promotion = document.querySelector('aside[class="product-promo"]');
      // @ts-ignore
      if (promotion !== null) promotion.setAttribute('promotion', promotion.innerText.split('\n').join(' '));

      const desc = document.querySelector('li#tab-details > div');
      // @ts-ignore
      if (desc !== null) desc.setAttribute('desc', desc.innerText.split('\n\n').join(' ').split('\n').join(' '));

      const address = document.querySelector('address');
      if (address !== null) address.setAttribute('address', address.innerText.split('\n').join(''));
      const name = document.querySelector('h1');
      if (name !== null) name.setAttribute('name', name.innerText.split('\n').join(' '));
      // @ts-ignore
      const totalFat = [...document.querySelectorAll('tr.nutrient-table__item td, ul > li > strong')].filter(e => e.innerText === 'Fett' || e.innerText === 'Rohfett');
      if (totalFat.length === 1) addElementToDocument('totalfat', totalFat[0].nextElementSibling.innerText);
    });

    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.ingredientsList) {
        row.ingredientsList.forEach(item => {
          item.text = item.text.split('\n').join('');
          if (item.text.includes('  ')) item.text = item.text.split('  ').join(' ');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          if (item.text.includes('Beschreibung')) item.text = item.text.split('Beschreibung').pop().trim();
          else { return item.text; }
        });
      }
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
