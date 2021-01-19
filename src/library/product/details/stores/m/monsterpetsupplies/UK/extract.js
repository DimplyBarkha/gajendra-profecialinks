// @ts-nocheck
const { cleanUp } = require('../../../../shared');

async function implementation({ url, id }, { transform }, context, { productDetails }) {
  const prodId = id;
  await context.evaluate(async (prodId) => {
    var getSiblings = function (elem) {
      // Setup siblings array and get the first sibling
      const siblings = [];
      let sibling = elem.parentNode.firstChild;

      // Loop through each sibling and push to the array
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
          siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
      return siblings;
    };

    function addElementToDom(element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    const skuNode = document.querySelector(`meta[content="${prodId}"]`);
    const productNode = getSiblings(skuNode);
    addElementToDom(prodId, 'sku');
    productNode.forEach((element) => {
      addElementToDom(element.getAttribute('content'), element.getAttribute('itemprop'));
    });

    const parentProdNode = skuNode.parentElement.parentElement;
    parentProdNode.setAttribute('target', 'to-add');

    const availRegExp = /http:\/\/schema\.org\/(.+)/;
    const availabilityElem = document.querySelector('div[id="availability"]');
    if (availabilityElem) {
      const availRaw = availabilityElem.textContent.match(availRegExp)[1];
      availabilityElem.textContent = availRaw === 'InStock' ? 'In Stock' : 'Out Of Stock';
    }

    const variantElem = document.evaluate(
      `//div[@class="price-wrap" and contains(. , "${prodId}")]`,
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    const nameElem = document.querySelector('div[id="name"]');
    const nameMatch = nameElem && nameElem.textContent.match(/((\d+)([,.]?\d+)?\s?\w{1,2})/);
    if (nameMatch) addElementToDom(nameElem.textContent.match(/((\d+)([,.]?\d+)?\s?\w{1,2})/)[1], 'quantity');

    const descriptionElem = document.querySelector('div[itemprop="description"]');
    const description = descriptionElem ? descriptionElem.innerText.replace(/\n+/g, ' ').trim() : '';
    addElementToDom(description, 'description');

    const ingredients = document.evaluate('//div[@itemprop="description"]//p[contains(. , "Ingredients")]/following-sibling::p[position() = 1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    addElementToDom(ingredients, 'ingredients');

    document.querySelector('img[class="zoomImg"]') ? addElementToDom('Yes', 'Zoom') : addElementToDom('No', 'Zoom');
  }, prodId);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: cleanUp,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
  ],
  implementation,
};
