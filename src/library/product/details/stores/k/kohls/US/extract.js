const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const availability = document.querySelector('h3[class="OOSprodNotAvail"]')
      ? 'Out Of Stock'
      : 'In Stock';

    addElementToDocument('availability', availability);

    const iframeVideoEl = document.querySelector('iframe[title="Product Videos"]');
    if (iframeVideoEl) {
      try {
        console.log(iframeVideoEl.contentDocument.querySelector('video[src]'));
        addElementToDocument('iframe_video', iframeVideoEl.contentDocument.querySelector('video[src]').getAttribute('src'));
      } catch (e) {
        console.log('there is no video in iframe');
      }
    }

    const skuScriptEl = document.evaluate("//script[contains(.,'productSKU\":') and not(@id)]", document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (skuScriptEl && /productSKU":"(\d+)",/.test(skuScriptEl)) {
      addElementToDocument('sku_from_script', skuScriptEl.match(/productSKU":"(\d+)",/)[1]);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    transform: cleanUp,
    domain: 'kohls.com',
    zipcode: '',
  },
  implementation,
};
