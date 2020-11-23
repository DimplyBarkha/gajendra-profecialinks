const { transform } = require('../shared');

//const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await context.waitForXPath('//article//a');

    await context.waitForSelector('article> a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('article> a');
      firstItem.click();
    });
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('label.cw-form-button-toggle__label')) ? document.querySelectorAll('label.cw-form-button-toggle__label').length : 0;
  });
  console.log('Variant Length', variantLength);
  if (variantLength >= 1) {
    for (let j = 0; j < variantLength; j++) {
      await preparePage(j, variantLength, true);
      console.log('Inside variants', j);
      if (j !== variantLength) { await context.extract(productDetails, { transform }); }
    }
    return;
  }

  async function preparePage(index, variantLength) {
    await context.evaluate(async (index, variantLength) => {
      function getSingleText(xpath, document, index) {
        const element = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element && element.snapshotLength > 0) {
          const elem = element.snapshotItem(index)
          return elem ? elem.textContent : '';
        } else {
          return '';
        }
      }

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const qtyXpath = '//div/input[@name="Size"]/..//label[@class="cw-form-button-toggle__label"]/span[2]';
      const qty = getSingleText(qtyXpath, document, index);
      addHiddenDiv('my-qty', qty);

      const variantIdXpath = '//div/input[@name="Size"]/..//label[@class="cw-form-button-toggle__label"]/span[2] | //div/input[@name="Color"]/..//label[@class="cw-form-button-toggle__label"]/span[2]';
      const variantId = getSingleText(variantIdXpath, document, index);
      addHiddenDiv('my-variantId', variantId);

      const variantIdXpath1 = '//div/input[@name="Color"]/..//label[@class="cw-form-button-toggle__label"]/span[2] ';
      const variantId1 = getSingleText(variantIdXpath1, document, index);
      addHiddenDiv('my-variantId1', variantId1 | variantId);
      
      const colorXpath = '//div/input[@name="Color"]/..//label[@class="cw-form-button-toggle__label"]/span[2]';
      const color = getSingleText(colorXpath, document, index);
      addHiddenDiv('my-color', color); 

      return [`#qty:${qty}`, `#variantId:${variantId}`, `#variantId1:${variantId1}`, `#color:${color}`]; //`#price:${price}`, `#availab:${availab}`, `#listPrice:${listPrice}`
    }, index, variantLength);
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  }
  console.log('ready to extract');
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    transform: transform,
    domain: 'chewy.com',
    zipcode: '',
  },
  implementation,
};
