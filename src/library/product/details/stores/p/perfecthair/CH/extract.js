async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(function () {
    // document.body.setAttribute("ii_url", window.location.href);

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    try {
      const updp = document.querySelector('div.tab-menu--cross-selling');
      const updpStyle = updp ? window.getComputedStyle(updp, null).getPropertyValue('display') : null;
      if (updpStyle === 'none') {
        updp.remove();
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }

    let dirToUse = document.evaluate('//div[contains(@class, "product--description")]//p[(strong|strong/span)[contains(text(),\'Directions of use\')]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
      .singleNodeValue;
    dirToUse = dirToUse ? dirToUse.nextElementSibling : '';
    let dirToUseText = '';
    while (dirToUse) {
      if (dirToUse.querySelector('strong')) {
        break;
      }
      dirToUseText += dirToUse.innerText;
      dirToUse = dirToUse.nextElementSibling;
    }
    addHiddenDiv('ii_dirToUseText', dirToUseText);
  });
  return await context.extract(productDetails, { transform });
}

const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    transform,
    domain: 'perfecthair.ch',
    zipcode: '',
  },
  implementation,
};
