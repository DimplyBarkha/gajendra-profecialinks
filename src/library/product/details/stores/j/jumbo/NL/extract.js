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

      const liTextElements = document.querySelectorAll('section.jum-additional-info.row li');
      liTextElements.forEach(el => {
        el.setAttribute('bullet', `|| ${el.textContent}`);
      });

      const notLiBulletElements = document.querySelectorAll('div.jum-summary-description p');
      notLiBulletElements.forEach(el => {
        el.textContent = el.textContent.replace(/(•)/g, ' || $1');
      });

      const firstPartDesc = document.evaluate('//div[@class="jum-summary-description"]/p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const secondPartDesc = document.evaluate('//div[contains(@class, "jum-nutritional-info")]/text()', document, null, XPathResult.STRING_TYPE, null);
      if (firstPartDesc && secondPartDesc) {
        firstPartDesc.textContent = firstPartDesc.textContent.replace(/( )(\|\|)/, ` ${secondPartDesc.stringValue} $2`);
      }

      const brandNode = document.evaluate('//section[@class="jum-additional-info row"]//div[@data-jum-product-details]/@data-jum-product-details | (//div[@class="jum-column-main "]//*[@data-jum-brand]/@data-jum-brand)[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const brand = brandNode.textContent.includes('brand') ? brandNode.textContent.match(/"brand":"(.+)",/)[1] : brandNode.textContent;
      addHiddenDiv('brand', brand);

      const isListPrice = document.evaluate('//span[@class="jum-product-price__old-price"]/span[not(@class="visually-hidden")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (isListPrice) {
        const listPrice = document.evaluate('concat(//span[@class="jum-product-price__old-price"]/span[not(@class="visually-hidden")],//span[@class="jum-price-format-mnemonic"])', document, null, XPathResult.STRING_TYPE, null);
        addHiddenDiv('listPrice', listPrice.stringValue);
      }
    });
    const dataRef = await context.extract(productDetails, { transform });
    function reduceInfoToOneField (field, separator = ' ') {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          console.log(element.text);
          fieldText += element.text + separator;
        });
        field[0].text = fieldText.slice(0, -separator.length);
        return field.splice(1);
      }
    }
    const ingredientsList = dataRef[0].group[0].ingredientsList;
    const description = dataRef[0].group[0].description;
    const allergyAdvice = dataRef[0].group[0].allergyAdvice;
    reduceInfoToOneField(description);
    reduceInfoToOneField(allergyAdvice);
    reduceInfoToOneField(ingredientsList);
    if (dataRef[0].group[0].variantId) {
      dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/:"(\w+)"/)[1];
    }
    if (dataRef[0].group[0].category) {
      dataRef[0].group[0].category[0].text = dataRef[0].group[0].category[0].text.match(/\/(.+)\//)[1];
      dataRef[0].group[0].category[0].text = dataRef[0].group[0].category[0].text.replace(/\//g, ' > ');
    }
    if (dataRef[0].group[0].variantId) {
      dataRef[0].group[0].sku = [{
        text: dataRef[0].group[0].variantId[0].text.match(/(\d+)/)[1],
      }];
    }
    if (dataRef[0].group[0].description && dataRef[0].group[0].description[0].text.includes('||')) {
      dataRef[0].group[0].additionalDescBulletInfo = [{
        text: dataRef[0].group[0].description[0].text.match(/(\|\|.+)/)[0],
      }];
    }

    return dataRef;
  },
};
