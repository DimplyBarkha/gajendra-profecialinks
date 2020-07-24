const { transform } = require('./format');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Scrolling to bottom of page where aplus images are located
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await context.evaluate(async function () {
    const element = document.getElementById('aplus');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  });
  try {
    await context.waitForXPath('//div[@id="aplus"]/..//h2 | //div[@id="aplus"]/..//div[contains(@class, "celwidget aplus-module")] | //div[@class="apm-hovermodule-slides-inner"]');
  } catch (error) {
    console.log('error: ', error);
  }
  await new Promise((resolve) => setTimeout(resolve, 2500));

  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let url = window.location.href;
    if (url.includes('?th=1')) {
      url = url.replace('?th=1', '');
    }
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: '75019',
  },
  implementation,
};
