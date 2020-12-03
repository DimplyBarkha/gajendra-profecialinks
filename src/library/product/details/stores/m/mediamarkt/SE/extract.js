const { transform } = require('./format');

/**
*
* @param { { url?: string, id?: string} } inputs
* @param { Record<string, any> } parameters
* @param { ImportIO.IContext } context
* @param { Record<string, any> } dependencies
*/
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Fetching gtin through directly available function from script tag
    let gtin = '';
    try {
      gtin = getEan();
    } catch (e) {
      console.log('Gtin function not available hence cannot be fetched....');
    }
    addHiddenDiv('added_gtim', gtin);
  });
  try {
    await context.waitForSelector('div[class*="InTheBox"]', { timeout: 45000 });
  } catch (error) {
    console.log('No in the box content');
  }
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.se',
    zipcode: '',
  },
  implementation,
};
