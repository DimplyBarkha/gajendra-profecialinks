const { transform } = require('../../../../shared');

async function implementation ({ url, id }, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const prodId = id;

  await context.evaluate(async (prodId) => {
    var getSiblings = function (elem) {
      // Setup siblings array and get the first sibling
      var siblings = [];
      var sibling = elem.parentNode.firstChild;

      // Loop through each sibling and push to the array
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
          siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }

      return siblings;
    };

    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    const skuNode = document.querySelector('meta[content="' + prodId + '"]');
    const productNode = getSiblings(skuNode);
    addElementToDom(prodId, 'sku');
    productNode.forEach((element) => {
      addElementToDom(
        element.getAttribute('content'),
        element.getAttribute('itemprop'));
    });

    const parentProdNode = skuNode.parentElement.parentElement;
    parentProdNode.setAttribute('target', 'to-add');

    const availRegExp = /http:\/\/schema\.org\/(.+)/;
    const elem = document.querySelector('div[id="availability"]');

    if (elem) {
      elem.textContent = elem.textContent.match(availRegExp)[1];
    }

    document.querySelector('img[class="zoomImg"]') ? addElementToDom('Yes', 'Zoom') : addElementToDom('No', 'Zoom');
  }, prodId);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: transform,
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
