/* eslint-disable prefer-const */
const { transform } = require('./format');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('a[class*="collapse in collapsed"]');
  } catch (e) {
    console.log('Error in click ingredient List');
  }
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const JSONObj = prod_details_array.prod_sku;
    addHiddenDiv('Added_sku', JSONObj);
    const scriptTagSelector = document.querySelector('script[type="text/javascript"]');
    // @ts-ignore
    const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
    let scriptTagJSON = '';
    try {
      scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
    } catch (e) {
      console.log('Error in converting text to JSON....');
      scriptTagJSON = '';
    }
    // @ts-ignore
    const gtin = scriptTagJSON ? scriptTagJSON.gtin13 : '';
    console.log('gtin', gtin);
    addHiddenDiv('added_gtinText', gtin);
    let descArr = [];
    let descElement1;
    let description1 = document.querySelector('div#collapseDetails');
    descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').replace(/\&nbsp;/gm, '').trim() : '';
    if (description1) {
      descArr.push(descElement1);
      console.log('descElement1: ', descElement1);
    }
    if (descArr) {
      let finalDes = descArr.join(' ');
      addHiddenDiv('Added_description', finalDes);
      console.log('finalDes: ', finalDes);
    }
    let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers[0].availability ? scriptTagJSON.offers[0].availability : '' : '' : '';
    availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
    addHiddenDiv('added_availabilityText', availabilityText);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: "''",
  },
  implementation,
};
