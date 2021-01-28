const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart',
    transform: cleanUp,
    domain: 'instacart.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const othersellerName = document.evaluate('//main[@id="main-content"]/div[contains(@class, \'rmq\')]/div[contains(@class, \'rmq\')]/section[2]/div/div[1]/h3 | //main[@id="main-content"]/div[contains(@class, \'rmq\')]/div[contains(@class, \'rmq\')]/section[1]/a[contains(.,\'Shop similar items at\')]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (othersellerName) {
        document.body.setAttribute('othersellername', othersellerName.textContent.replace('Shop similar items at ', ''));
      }
      //  const variantFlavor = document.querySelector('ul[aria-labelledby*="variant-selections"] li button[aria-label*="select"]');
      //  const nameExtendedWithVariant = document.evaluate(`concat(//div[contains(@class, "itemModalHeader")]//h2[contains(@class, "item-title")], " - ", //ul[contains(@aria-labelledby, "variant-selections")]//li//button[contains(@aria-label, "select")])`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      //  const name = document.evaluate(`//div[contains(@class, "itemModalHeader")]//h2[contains(@class, "item-title")]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();

    //  if(nameExtendedWithVariant) {
    //   addHiddenDiv('ii_nameExtended', nameExtendedWithVariant);
    //  } else if (name) {
    //    addHiddenDiv('ii_nameExtended', name);
    //  }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
