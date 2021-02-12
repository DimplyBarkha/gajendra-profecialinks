const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }

      // select each text node in description section and replace signs which are indicating that text is bullet point to double pipes
      function changebulletPointsToDoublePipes (selector) {
        const descriptionTextNodes = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < descriptionTextNodes.snapshotLength; i++) {
          console.log(descriptionTextNodes.snapshotItem(i).textContent);
          descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^ *?(•|-|\*|\d\.|✓)/, ' || ');
          if ((/^\s*(•|-|\*|\d\.|✓)\s*$/).test(descriptionTextNodes.snapshotItem(i).textContent)) {
            descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^\s*(•|-|\*|\d\.|✓)\s*$/, ' || ');
          }
        }
      }
      function extractNutritionInfo () {
        // column position in table data where nutrition data per 100 g/ml is stored. This way we prioritize the column which contains most valuable / valid nutrition data, as we need to scrape each nutrition value from whichin targeted serving size.
        let columnPosition = document.evaluate('count((//thead)[1]/tr//th[contains(.,"100")][not(contains(.,"*"))][1]/preceding-sibling::th)', document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (columnPosition === '0') {
          columnPosition = document.evaluate('count((//thead)[1]/tr//th[contains(.,"100")][1]/preceding-sibling::th)', document, null, XPathResult.STRING_TYPE, null).stringValue;
          if (columnPosition === '0') {
            columnPosition = document.evaluate('count((//thead)[1]/tr//th[contains(translate(., "Per", "per"), "per")][not(contains(.,"%"))][1]/preceding-sibling::th)', document, null, XPathResult.STRING_TYPE, null).stringValue;
            if (columnPosition === '0') {
              columnPosition = document.evaluate('count((//thead)[1]/tr//th[last()]/preceding-sibling::th)', document, null, XPathResult.STRING_TYPE, null).stringValue;
            }
          }
        }
        const servingSize = document.evaluate(`//thead/tr/th[@class="jum-nutiriton-heading"][${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        let caloriesPerServing = document.evaluate(`//th[contains(translate(., "Energ", "energ"), "energ")]/parent::tr/following-sibling::tr[1]/th[not(text())]/following-sibling::td[${columnPosition}] | //th[contains(translate(., "Energ", "energ"), "energ")]/following-sibling::td[${columnPosition}][contains(text(),"kcal")] | //th[contains(translate(., "Kcal", "kcal"), "kcal")]/following-sibling::td[${columnPosition}][contains(text(),"kcal")] |  //th[contains(translate(., "Kcal", "kcal"), "kcal")]/following-sibling::td[${columnPosition}] | //th[contains(translate(., "Energ", "energ"), "energ")]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        // if calories cant be found in any rational way we scrape text from any td element containing phrase 'kcal'
        if (!caloriesPerServing) {
          caloriesPerServing = document.evaluate('//td[contains(translate(., "Kcal", "kcal"), "kcal")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
        }
        const totalFatPerServing = document.evaluate(`//th[contains(translate(., "Vet", "vet"), "vet")]/following-sibling::td[${columnPosition}] | //th[contains(translate(., "Fat", "fat"), "fat")]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const saturatedFatPerServing = document.evaluate(`//th[contains(translate(., 'Verzadigd', 'verzadigd'), 'verzadigd')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Saturates', 'saturates'), 'saturates')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const sodiumPerServing = document.evaluate(`//th[contains(translate(., 'Natrium', 'natrium'), 'natrium')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Sodium', 'sodium'), 'sodium')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const totalCarbPerServing = document.evaluate(`//th[contains(translate(., 'Koolhydraten', 'koolhydraten'), 'koolhydraten')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Carbohydrate', 'carbohydrate'), 'carbohydrate')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const dietaryFibrePerServing = document.evaluate(`//th[contains(translate(., 'Vezels', 'vezels'), 'vezels')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Fiber', 'fiber'), 'fiber')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const totalSugarsPerServing = document.evaluate(`//th[contains(translate(., 'Suiker', 'suiker'), 'suiker')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Sugar', 'sugar'), 'sugar')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const proteinPerServing = document.evaluate(`//th[contains(translate(., 'Eiwit', 'eiwit'), 'eiwit')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Proteïn', 'proteïn'), 'proteïn')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Protein', 'protein'), 'protein')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const vitaminAPerServing = document.evaluate(`//th[contains(translate(., 'Vitamine A', 'vitamine a'), 'vitamine a')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const vitaminCPerServing = document.evaluate(`//th[contains(translate(., 'Vitamine C', 'vitamine c'), 'vitamine c')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const calciumPerServing = document.evaluate(`//th[contains(translate(., 'Calcium', 'calcium'), 'calcium')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const magnesiumPerServing = document.evaluate(`//th[contains(translate(., 'Magnesium', 'magnesium'), 'magnesium')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        const saltPerServing = document.evaluate(`//th[contains(translate(., 'Zout', 'zout'), 'zout')]/following-sibling::td[${columnPosition}] | //th[contains(translate(., 'Salt', 'salt'), 'salt')]/following-sibling::td[${columnPosition}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        addHiddenDiv('servingSize', servingSize);
        addHiddenDiv('caloriesPerServing', caloriesPerServing);
        addHiddenDiv('totalFatPerServing', totalFatPerServing);
        addHiddenDiv('saturatedFatPerServing', saturatedFatPerServing);
        addHiddenDiv('sodiumPerServing', sodiumPerServing);
        addHiddenDiv('totalCarbPerServing', totalCarbPerServing);
        addHiddenDiv('dietaryFibrePerServing', dietaryFibrePerServing);
        addHiddenDiv('totalSugarsPerServing', totalSugarsPerServing);
        addHiddenDiv('proteinPerServing', proteinPerServing);
        addHiddenDiv('vitaminAPerServing', vitaminAPerServing);
        addHiddenDiv('vitaminCPerServing', vitaminCPerServing);
        addHiddenDiv('calciumPerServing', calciumPerServing);
        addHiddenDiv('magnesiumPerServing', magnesiumPerServing);
        addHiddenDiv('saltPerServing', saltPerServing);
      }
      extractNutritionInfo();
      changebulletPointsToDoublePipes('//div[@class="jum-summary-description"]/p/text()');

      const categories = document.evaluate('//a[contains(@href,"categorieen")]/@href', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (categories) {
        const categoriesArray = categories.match(/categorieen\/(.+)/)[1].split('/');
        if (categories.length > 0) {
          categoriesArray.forEach(category => {
            addHiddenDiv('category', category);
          });
        }
      }

      const brandNode = document.evaluate('//section[@class="jum-additional-info row"]//div[@data-jum-product-details]/@data-jum-product-details | (//div[@class="jum-column-main "]//*[@data-jum-brand]/@data-jum-brand)[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (brandNode.textContent.includes('brand')) {
        addHiddenDiv('brand', brandNode.textContent.match(/"brand":"(.+)",/)[1]);
      }
      const isListPrice = document.evaluate('//span[@class="jum-product-price__old-price"]/span[not(@class="visually-hidden")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (isListPrice) {
        const listPrice = document.evaluate('concat(//span[@class="jum-product-price__old-price"]/span[not(@class="visually-hidden")],//span[@class="jum-price-format-mnemonic"])', document, null, XPathResult.STRING_TYPE, null);
        addHiddenDiv('listPrice', listPrice.stringValue);
      }

      const priceWholes = document.evaluate('//span[@class="jum-product-price__current-price--larger"]', document, null, XPathResult.STRING_TYPE, null);
      const priceFractions = document.evaluate('//span[@class="jum-product-price__current-price--larger"]/following-sibling::span', document, null, XPathResult.STRING_TYPE, null);
      if (priceWholes.stringValue.length > 0) {
        addHiddenDiv('price', `${priceWholes.stringValue},${priceFractions.stringValue}€`);
      }

      const variantRegexp = /\/(\d{3,}.+)\/$/;
      const variantIdLinkElement = document.querySelector('link[rel="canonical"]');
      if (variantIdLinkElement) {
        const variantMatch = variantRegexp.exec(variantIdLinkElement.getAttribute('href'));
        if (variantMatch[1]) {
          addHiddenDiv('variantId', variantMatch[1]);
        }
      } else {
        const bodyVariantId = document.querySelector('body').getAttribute('class');
        addHiddenDiv('variantId', bodyVariantId);
      }

      // only way to scrape nameExtended and price fields from broken/raw details page
      const htmlJsonElement = document.querySelector('body>section[class="jum-additional-info row"]>div[data-jum-product-details]');
      if (htmlJsonElement) {
        const jsonObj = JSON.parse(htmlJsonElement.getAttribute('data-jum-product-details'));
        addHiddenDiv('nameExtended', jsonObj.name);
        addHiddenDiv('price', String(jsonObj.price).replace('.', ',') + '€');
      }

      addHiddenDiv('url', window.location.href);
    });
    const dataRef = await context.extract(productDetails, { transform });
    function reduceInfoToOneField (field, separator = ' ') {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          fieldText += element.text + separator;
        });
        field[0].text = fieldText.slice(0, -separator.length);
        return field.splice(1);
      }
    }
    const ingredientsList = dataRef[0].group[0].ingredientsList;
    const description = dataRef[0].group[0].description;
    const allergyAdvice = dataRef[0].group[0].allergyAdvice;
    const manufacturer = dataRef[0].group[0].manufacturer;
    reduceInfoToOneField(description, ' | ');
    reduceInfoToOneField(allergyAdvice);
    reduceInfoToOneField(ingredientsList);
    reduceInfoToOneField(manufacturer);
    if (dataRef[0].group[0].variantId[0].text.includes(':')) {
      dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/id":"(.+?)"/)[1];
    }
    if (dataRef[0].group[0].variantId) {
      dataRef[0].group[0].sku = [{
        text: dataRef[0].group[0].variantId[0].text.match(/(\d+)/)[1],
      }];
    }
    if (dataRef[0].group[0].description && dataRef[0].group[0].description[0].text.includes('||')) {
      const bulletInfoArray = dataRef[0].group[0].description[0].text.match(/( ?\|\|.+)/g);
      let bulletInfoString = '';
      bulletInfoArray.forEach(bullet => {
        bulletInfoString += bullet;
      });
      dataRef[0].group[0].additionalDescBulletInfo = [{
        text: bulletInfoString.replace(/\s\|\s.+/, ''),
      }];
      dataRef[0].group[0].descriptionBullets = [{
        text: bulletInfoArray.length,
      }];
    }
    if (dataRef[0].group[0].category) {
      dataRef[0].group[0].category[0].text = dataRef[0].group[0].category[0].text.replace(/(-)/g, '');
    }

    dataRef[0].group[0].variantCount = [{
      text: '0',
    }];

    return dataRef;
  },
};
