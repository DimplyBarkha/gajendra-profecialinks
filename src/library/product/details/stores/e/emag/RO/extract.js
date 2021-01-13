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

      const price = document.querySelector('div.product-highlights-wrapper p.product-new-price');
      if (price) {
        price.querySelector('sup').textContent = `,${price.querySelector('sup').textContent}`;
        addElementToDocument('price', price.textContent.replace(/\./g, '').match(/\d.+/)[0]);
      }
    });
    const dataRef = await context.extract(productDetails, { transform });
    const description = dataRef[0].group[0].description;
    reduceInfoToOneField(description);
    const directions = dataRef[0].group[0].directions;
    reduceInfoToOneField(directions);
    if (dataRef[0].group[0].manufacturerDescription && dataRef[0].group[0].manufacturerDescription.length > 1) {
      reduceInfoToOneField(dataRef[0].group[0].manufacturerDescription);
    }
    if (dataRef[0].group[0].listPrice) {
      if (dataRef[0].group[0].listPrice[0].text === ',') {
        delete dataRef[0].group[0].listPrice;
      }
    }
    if (dataRef[0].group[0].price) {
      if (dataRef[0].group[0].price[0].text === ',') {
        delete dataRef[0].group[0].price;
      }
    }
    if (dataRef[0].group[0].aggregateRating) {
      dataRef[0].group[0].aggregateRating[0].text = dataRef[0].group[0].aggregateRating[0].text.replace('.', ',');
      dataRef[0].group[0].aggregateRatingText[0].text = dataRef[0].group[0].aggregateRatingText[0].text.replace('.', ',');
    }
    if (dataRef[0].group[0].variants) {
      dataRef[0].group[0].variantCount[0].text = dataRef[0].group[0].variants.length;
    }
    if (dataRef[0].group[0].brandLink) {
      dataRef[0].group[0].brandLink[0].text = `http://www.emag.ro${dataRef[0].group[0].brandLink[0].text}`;
    }
    if (dataRef[0].group[0].videos) {
      dataRef[0].group[0].videos.forEach((element, index) => {
        if (element.text.includes('[')) {
          element.text.match(/"mp4":.+?url":"(.+?)"/).length > 1 ? element.text = element.text.match(/"mp4":.+?url":"(.+?)"/)[1] : delete dataRef[0].group[0].videos[index];
        }
      });
    }
    return dataRef;
  },
};
