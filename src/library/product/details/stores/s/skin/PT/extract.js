const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForSelector('div.fotorama__stage__frame');

  await context.evaluate(() => {
    function addHiddenDiv (myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    //  function getElementByXpath(path) {
    //   return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // }

    document.querySelector('div.fotorama__stage__frame').click();
    console.log('Clicking');
    // const image = getElementByXpath('//div[contains(@class,"fotorama__loaded--img")][position()>1]/img/@src').textContent

    // addHiddenDiv('img', image)
    // document.querySelector('div[aria-label="Exit fullscreen"]').click()
    // console.log('Closing')
    // // addHiddenDiv('img', image)

    let terms = 'No';
    if (document.querySelector('a[href="/termos-e-condicoes"]')) {
      terms = 'Yes';
    }
    addHiddenDiv('terms', terms);

    // const promotion = document.querySelector('.product-tag').textContent
    // .replace(/\s+/g, '')
    // if(promotion !=null && promotion !=undefined && promotion) {
    //   console.log('*******************************')
    //   addHiddenDiv('promotion', promotion);
    // }

    //     const description =
    //   (document.querySelector('div.product-info-main > div.product.attribute.description > div') &&
    //     document.querySelector('div.product-info-main > div.product.attribute.description > div').textContent
    //       .split(/[\n]/)
    //       .join('||'));
    //     addHiddenDiv('description', description);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    transform: cleanUp,
    domain: 'skin.pt',
    zipcode: '',
  },
  implementation,
};
