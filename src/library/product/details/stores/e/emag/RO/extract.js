const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    transform: cleanUp,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    function reduceInfoToOneField (field) {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          fieldText += ' -' + element.text;
        });
        field[0].text = fieldText.replace(/\n/g, ': ');
        return field.splice(1);
      }
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('url', window.location.href);
      const otherInfo = document.evaluate('//p[contains(.,"Caracteristici generale")]/following-sibling::div[@class="table-responsive"]//tbody/tr', document, null, XPathResult.ANY_TYPE, null );
      const nodes = [];
      let node;
      while (node = otherInfo.iterateNext()) {
        nodes.push(node);
      }
      if (nodes.length > 0) {
        let text = '';
        nodes.forEach(info => {
          console.log(info.textContent);
          text += `${info.textContent.trim()} || `;
        });
        addElementToDocument('other-info', text);
      }
    });
    const dataRef = await context.extract(productDetails, { transform });
    const description = dataRef[0].group[0].description;
    reduceInfoToOneField(description);
    const directions = dataRef[0].group[0].directions;
    reduceInfoToOneField(directions);
    if (dataRef[0].group[0].sku) {
      dataRef[0].group[0].variantId = dataRef[0].group[0].sku;
    }
    if (dataRef[0].group[0].listPrice) {
      if (dataRef[0].group[0].listPrice[0].text === '.') {
        delete dataRef[0].group[0].listPrice;
      }
    }
    return dataRef;
  },
};
