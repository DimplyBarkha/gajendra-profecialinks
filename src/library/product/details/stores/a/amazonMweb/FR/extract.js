const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.fr',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const element = document.getElementById('aplus');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 2197));
    }
    try {
      await context.waitForXPath('//div[@id="aplus"]/..//h2 | //div[@id="aplus"]/..//div[contains(@class, "celwidget aplus-module")] | //div[@class="apm-hovermodule-slides-inner"]');
    } catch (error) {
      console.log('error: ', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2197));
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let enhancedContent = document.querySelector('div#aplus');
    // @ts-ignore
    enhancedContent = enhancedContent ? enhancedContent.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
    addElementToDocument('a_enhancedContent', enhancedContent);
    addElementToDocument('a_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}
