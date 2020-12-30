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

      const brandNode = document.evaluate('//section[@class="jum-additional-info row"]//div[@data-jum-product-details]/@data-jum-product-details', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const brand = brandNode.textContent.match(/"brand":"(.+)",/)[1];
      addHiddenDiv('brand', brand);
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
    reduceInfoToOneField(description);
    reduceInfoToOneField(ingredientsList, ', ');
    if (dataRef[0].group[0].variantId) {
      dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/:"(\w+)"/)[1];
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
