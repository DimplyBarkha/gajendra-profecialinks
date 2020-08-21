
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
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

  // Fetching brand from JSON and if not available then first word from the product name
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const brandSelector = document.querySelector('div[data-id="productData"]');
    const brandJSON = brandSelector ? brandSelector.getAttribute('data-value') : '';
    const brandObj = JSON.parse(brandJSON);
    let brand = brandObj.Brand;
    if (!brand) {
      const nameSelector = document.querySelector('h1[id="lblProductName"]');
      const name = nameSelector ? nameSelector.innerText : '';
      brand = name ? name.replace(/^([\w]+).*/gm, '$1') : '';
    }
    addHiddenDiv('added-brand', brand);

    // Adding variantCount based on variants present on the website else 1
    const variantCountSelector = document.querySelectorAll('div[id="radStyle"] > label');
    let variantCount = variantCountSelector ? variantCountSelector.length : '';
    if (!variantCount) {
      variantCount = 1;
    }
    addHiddenDiv('added-variantCount', variantCount);

    // Adding additional description bullet info by looping through description as li tags are not avaialble on webpage
    const descriptionSelector = document.querySelector('div[id="infoTabContent"] div[id="tab0"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    const descriptionArray = description ? description.split('\n') : [];
    const bulletInfoArray = [];
    for (let i = 0; i < descriptionArray.length; i++) {
      const descObj = descriptionArray[i];
      if (descObj.includes('•')) {
        bulletInfoArray.push(descObj.replace('•', '').trim());
      }
    }
    const additionalDescBulletInfo = bulletInfoArray.join(' || ');
    addHiddenDiv('added-additionalDescBulletInfo', additionalDescBulletInfo);
  });

  await new Promise(resolve => setTimeout(resolve, 20000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform,
    domain: 'tsc.ca',
    zipcode: '',
  },
  implementation,
};
