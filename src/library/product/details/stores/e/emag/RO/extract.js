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
    await context.evaluate(async () => {
      const bulletTextElements = document.querySelectorAll('div#description-body li');
      bulletTextElements.forEach(el => {
        el.textContent = `|| ${el.textContent}`;
      });
    });

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
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('url', window.location.href);
      const otherInfo = document.evaluate('//p[contains(.,"Caracteristici generale")]/following-sibling::div[@class="table-responsive"]//tbody/tr', document, null, XPathResult.ANY_TYPE, null);
      const nodes = [];
      let node;
      node = otherInfo.iterateNext();
      while (node) {
        nodes.push(node);
        node = otherInfo.iterateNext();
      }
      if (nodes.length > 0) {
        let text = '';
        nodes.forEach(info => {
          text += `${info.textContent.trim()} || `;
        });
        text = text.slice(0, -3);
        addElementToDocument('other-info', text);
      }
    });
    const dataRef = await context.extract(productDetails, { transform });
    const description = dataRef[0].group[0].description;
    reduceInfoToOneField(description);
    const directions = dataRef[0].group[0].directions;
    reduceInfoToOneField(directions);
    if (dataRef[0].group[0].listPrice) {
      if (dataRef[0].group[0].listPrice[0].text === '.') {
        delete dataRef[0].group[0].listPrice;
      }
    }
    return dataRef;
  },
};
