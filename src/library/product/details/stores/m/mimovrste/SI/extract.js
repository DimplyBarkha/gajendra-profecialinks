/* eslint-disable no-redeclare */
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    transform: cleanUp,
    domain: 'mimovrste.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
      const description = getAllXpath("//section[@class='pro-column'][2]//h3/text() | //section[@class='pro-column'][2]//p[@itemprop='description']/text()", 'nodeValue').join(' ');
      addElementToDocument('added_description', description);

      var servingSize = getXpath("//td[contains(text(),'skodelice')]//following::td/b/text()", 'nodeValue');
      if (servingSize) {
        const servingSizeElements = servingSize.replace(/\s/g, ':').split(':');
        addElementToDocument('added_serving_size', servingSizeElements[0]);
        addElementToDocument('added_serving_size_unit', servingSizeElements[1]);
      } else {
        servingSize = getXpath("//li[contains(text(),'skodelice')]/text()", 'nodeValue');
        if (servingSize) {
          const servingSizeElements = servingSize.split(':');
          const servingSizeValue = servingSizeElements[1].match(/\d+/g);
          const servingSizeUnit = servingSizeElements[1].match(/[a-zA-Z]+/g);
          addElementToDocument('added_serving_size', servingSizeValue);
          addElementToDocument('added_serving_size_unit', servingSizeUnit);
        }
      }

      var calories = getXpath("//li[contains(text(), 'energijska')] | //li[contains(text(), 'Energijska')]", 'innerText');
      if (calories) {
        calories = calories.replace(':', ',');
        const caloriesElements = calories.split(',');
        addElementToDocument('added_calories', caloriesElements[1]);
      }

      var fat = getXpath("//li[contains(text(), 'Maščobe')]", 'innerText');

      if (fat) {
        const fatElements = fat.split(/,(.+)/);
        const fatValueElements = fatElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_fat', fatValueElements[0]);
        addElementToDocument('added_fat_unit', fatValueElements[1]);
      } else {
        fat = getXpath("//li[contains(text(), 'Masti')]", 'innerText');
        if (fat) {
          if (fat.includes('(')) {
            var fatElements = fat.substring(0, fat.indexOf('(') - 1);
            fatElements = fatElements.split(':');
            const fatValue = fatElements[1].match(/\d+/g);
            const fatUnit = fatElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_fat', fatValue);
            addElementToDocument('added_fat_unit', fatUnit);

            var saturatedFatElements = fat.substring(fat.indexOf('('), fat.indexOf(')'));
            const saturatedFatElementValue = saturatedFatElements.match(/\d+/g);
            const saturatedFatElementUnit = fatElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_saturated_fat', saturatedFatElementValue);
            addElementToDocument('added_saturated_fat_unit', saturatedFatElementUnit);
          } else {
            var fatElements = fat.split(',').slice(0, 2);
            fatElements = fatElements.join(',');
            fatElements = fatElements.split(':');
            const fatValue = fatElements[1].match(/\d+/g);
            const fatUnit = fatElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_fat', fatValue);
            addElementToDocument('added_fat_unit', fatUnit);

            var saturatedFatElements = fat.split(',').slice(2);
            saturatedFatElements = saturatedFatElements.join(',');
            saturatedFatElements = saturatedFatElements.split(':');
            const saturatedFatValue = saturatedFatElements[1].match(/\d+/g);
            const saturatedFatUnit = saturatedFatElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_saturated_fat', saturatedFatValue);
            addElementToDocument('added_saturated_fat_unit', saturatedFatUnit);
          }
        }
      }

      const saturatedFat = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'nasičene maščobe,')]", 'innerText');
      if (saturatedFat) {
        const saturatedFatElements = saturatedFat.split(/,(.+)/);
        const saturatedFatValueElements = saturatedFatElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_saturated_fat', saturatedFatValueElements[0]);
        addElementToDocument('added_saturated_fat_unit', saturatedFatValueElements[1]);
      }

      var carb = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'ogljikovi')]", 'innerText');
      if (carb) {
        const carbElements = carb.split(/,(.+)/);
        const carbValueElements = carbElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_carb', carbValueElements[0]);
        addElementToDocument('added_carb_unit', carbValueElements[1]);
      } else {
        carb = getXpath("//li[contains(text(), 'Ogljikovi')]", 'innerText');
        if (carb) {
          if (carb.includes('(')) {
            var carbElements = carb.substring(0, carb.indexOf('(') - 1);
            carbElements = carbElements.split(':');
            const carbValue = carbElements[1].match(/\d+/g);
            const carbUnit = carbElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_carb', carbValue);
            addElementToDocument('added_carb_unit', carbUnit);

            var sugarElements = carb.substring(carb.indexOf('('), carb.indexOf(')'));
            const sugarValue = sugarElements.match(/\d+/g);
            const sugarUnit = carbElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_sugar', sugarValue);
            addElementToDocument('added_sugar_unit', sugarUnit);
          } else {
            var carbElements = carb.split(',').slice(0, 2);
            carbElements = carbElements.join(',');
            carbElements = carbElements.split(':');
            const carbValue = carbElements[1].match(/\d+/g);
            const carbUnit = carbElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_carb', carbValue);
            addElementToDocument('added_carb_unit', carbUnit);

            var sugarElements = carb.split(',').slice(2);
            sugarElements = sugarElements.join(',');
            sugarElements = sugarElements.split(':');
            const sugarValue = sugarElements[1].match(/\d+/g);
            const sugarUnit = sugarElements[1].match(/[a-zA-Z]+/g);
            addElementToDocument('added_sugar', sugarValue);
            addElementToDocument('added_sugar_unit', sugarUnit);
          }
        }
      }

      var fiber = getXpath("//li[contains(text(), 'vlaknine')]", 'innerText');
      if (fiber) {
        fiber = fiber.replace(':', ',');
        const fiberElements = fiber.split(/,(.+)/);
        const fiberValueElements = fiberElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_fiber', fiberValueElements[0]);
        addElementToDocument('added_fiber_unit', fiberValueElements[1]);
      }

      const sugar = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'sladkorji')]", 'innerText');
      if (sugar) {
        const sugarElements = sugar.split(/,(.+)/);
        const sugarValueElements = sugarElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_sugar', sugarValueElements[0]);
        addElementToDocument('added_sugar_unit', sugarValueElements[1]);
      }

      var protein = getXpath("//li[contains(text(), 'beljakovine')] | //li[contains(text(), 'Beljakovine')]", 'innerText');
      if (protein) {
        protein = protein.replace(':', ',');
        const proteinElements = protein.split(/,(.+)/);
        const proteinValueElements = proteinElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_protein', proteinValueElements[0]);
        addElementToDocument('added_protein_unit', proteinValueElements[1]);
      }

      var salt = getXpath("//li[contains(text(), 'sol')] | //li[contains(text(), 'Sol')]", 'innerText');
      if (salt) {
        salt = salt.replace(':', ',');
        const saltElements = salt.split(/,(.+)/);
        const saltValueElements = saltElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_salt', saltValueElements[0]);
        addElementToDocument('added_salt_unit', saltValueElements[1]);
      }
      const specifications = getAllXpath("//h2[contains(text(), 'Tehnične')]//following::section[@class='panel-inner']//table//tr", 'innerText').join(' || ');
      addElementToDocument('added_specifications', specifications);

      const dimensions = getXpath("//tr//td[contains(text(), 'Dimenzije škatle')]//following-sibling::td//b", 'innerText');
      addElementToDocument('added_dimensions', dimensions);

      const storage = getXpath("//tr//td[contains(text(), 'shranjevanja')]//following-sibling::td//b", 'innerText');
      addElementToDocument('added_storage', storage);

      const aggregateRating = getXpath("//span[@itemprop='ratingValue']", 'innerText');
      if (aggregateRating) {
        addElementToDocument('added_aggregateRating', aggregateRating.replace('.', ','));
      }

      const listPrice = getXpath("//del[@class='rrp-price']", 'innerText');
      if (listPrice) {
        addElementToDocument('added_listPrice', listPrice.replace(/,/g, '.'));
      }

      const availability = getXpath("//div[@class='add-to-cart-button']", 'innerText');
      if (availability) {
        addElementToDocument('added_availability', 'In Stock');
      } else {
        addElementToDocument('added_availability', 'Out of Stock');
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
