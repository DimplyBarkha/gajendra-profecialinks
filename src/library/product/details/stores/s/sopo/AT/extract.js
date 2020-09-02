
const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'sopo',
    transform: cleanUp,
    domain: 'sopo.at',
    zipcode: '',
  },
  implementation: async ({ x }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const numberOfDimensions = document.evaluate("//li[contains(text(), 'Verpackungs')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const text = [];
      for (x = 1; x < numberOfDimensions.snapshotLength + 1; x++) {
        const abc = document.evaluate(`//li[contains(text(), 'Verpackungs')][${x}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        text.push(abc);
      }
      const properText = text.toString();
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'dimension');
      newDiv.innerHTML = properText;
      document.body.appendChild(newDiv);
    });
    await context.extract(productDetails);
  },
};
