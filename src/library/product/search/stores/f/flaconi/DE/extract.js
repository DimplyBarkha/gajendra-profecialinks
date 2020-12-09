const { transform } = require('../../../../shared');  
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.waitForFunction(function () {
  //   return Boolean(document.querySelector('div[id="rd-item-grid"]') || document.evaluate('//div[@id="rd-item-grid"]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  // }, { timeout: 90000 });

  await context.evaluate(async function () {
    // function addclass(xpathforpagination) {
    //   var elems = document.querySelectorAll(xpathforpagination);
    //   elems[0].classList.add('pagination');
    // }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }try {
      document.getElementById('pd_url').remove();
    } catch (error) {
    }
    addElementToDocument('pd_url', URL);
  });
  return await context.extract(productDetails, { transform });
}