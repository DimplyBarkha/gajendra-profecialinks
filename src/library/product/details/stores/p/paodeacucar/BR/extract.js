const { cleanUp } = require('../../../../shared');
const implementation = async (inputs, parameters, context, dependencies) => {
  const { cleanUp } = parameters;
  const { productDetails } = dependencies;

  const sku = await context.evaluate(async function () {
    return document.querySelector('.textstyles__TextComponent-w4b5ef-0.kpBcNm');
  });
  if (sku === null) {
    await context.waitForSelector('div.product-cardstyles__CardStyled-sc-1uwpde0-0.jRrfZx.cardstyles-yvvqkp-0.fkRPuy > .product-cardstyles__Container-sc-1uwpde0-1.eaVrql');
  };
  async function firstItemLink() {
    return await context.evaluate(function () {
      const firstItem = document.querySelector('div.product-cardstyles__CardStyled-sc-1uwpde0-0.jRrfZx.cardstyles-yvvqkp-0.fkRPuy > .product-cardstyles__Container-sc-1uwpde0-1.eaVrql > a');
      if (firstItem !== null) {
        //@ts-ignore
        return firstItem.href;
      }
    });
  }
  const url = await firstItemLink();
  if (url !== null && url !== undefined) {
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  }
  const currentUrl = await context.evaluate(() => {
    return document.URL
  })
  await context.waitForSelector('div#lett-econtent-placeholder > iframe');
  const manufLink = await context.evaluate(async function () {
    //@ts-ignore
    return document.querySelector('div#lett-econtent-placeholder > iframe').src;
  });
  await context.goto(manufLink);
  const manufText = await context.evaluate(async function () {
    return document.querySelector('body').innerText;
  });
  await context.goto(currentUrl)
  await context.evaluate(async function (manufText) {

    function addHiddenDiv(id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv
    };

    addHiddenDiv('manufDesc', manufText);
  }, manufText);
  return await context.extract(productDetails, { cleanUp });

};
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    transform: cleanUp,
    domain: 'paodeacucar.com',
    zipcode: '',
  },
  implementation,
};
