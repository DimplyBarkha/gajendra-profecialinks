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

      const servingSize = getXpath("//td[contains(text(),'skodelice')]//following::td/b/text()", 'nodeValue');
      if (servingSize) {
        const servingSizeElements = servingSize.replace(/\s/g, ':').split(':');
        addElementToDocument('added_serving_size', servingSizeElements[0]);
        addElementToDocument('added_serving_size_unit', servingSizeElements[1]);
      }

      const calories = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'energijska')]", 'innerText');
      if (calories) {
        const caloriesElements = calories.split(',');
        addElementToDocument('added_calories', caloriesElements[1]);
      }

      const fat = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'Maščobe')]", 'innerText');

      if (fat) {
        const fatElements = fat.split(/,(.+)/);
        const fatValueElements = fatElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_fat', fatValueElements[0]);
        addElementToDocument('added_fat_unit', fatValueElements[1]);
      }

      const saturatedFat = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'nasičene maščobe,')]", 'innerText');
      if (saturatedFat) {
        const saturatedFatElements = saturatedFat.split(/,(.+)/);
        const saturatedFatValueElements = saturatedFatElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_saturated_fat', saturatedFatValueElements[0]);
        addElementToDocument('added_saturated_fat_unit', saturatedFatValueElements[1]);
      }

      const carb = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'ogljikovi')]", 'innerText');
      if (carb) {
        const carbElements = carb.split(/,(.+)/);
        const carbValueElements = carbElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_carb', carbValueElements[0]);
        addElementToDocument('added_carb_unit', carbValueElements[1]);
      }

      const fiber = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'vlaknine')]", 'innerText');
      if (fiber) {
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

      const protein = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'beljakovine')]", 'innerText');
      if (protein) {
        const proteinElements = protein.split(/,(.+)/);
        const proteinValueElements = proteinElements[1].trim().replace(/\s/g, ':').split(':');
        addElementToDocument('added_protein', proteinValueElements[0]);
        addElementToDocument('added_protein_unit', proteinValueElements[1]);
      }

      const salt = getXpath("//section[@class='panel-inner']//h3[contains(text(), 'Hranilne')]//following::ul//li[contains(text(), 'sol')]", 'innerText');
      if (salt) {
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
