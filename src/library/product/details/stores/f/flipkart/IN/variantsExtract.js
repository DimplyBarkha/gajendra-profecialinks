const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  const { transform } = parameters;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      const regx = /(pid=([0-9a-zA-Z]+))/g;
      const match = regx.exec(content);
      // content = content.replace(/(?<=html).+/gm, '');
      newDiv.title = match[2];
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    const variantContainer = document.querySelector('div._1YokD2._3Mn1Gg.col-8-12 > div > div > div:nth-child(1) > div._22QfJJ > ul');
    if (variantContainer) {
      const variants = variantContainer.querySelectorAll('div._1YokD2._3Mn1Gg.col-8-12 > div > div > div:nth-child(1) > div._22QfJJ > ul>li>a');
      if (variants.length != 0) {
        for (var i = 0; i < variants.length; i++) {
          variants[i].click();
          // let url = window.location.href;
          // let prefix = url.substring(url.indexOf('m/') + 1);
          // addHiddenDiv('prefix',prefix);
          addHiddenDiv('variantURL', window.location.href);
        }
      }
    } else {
      addHiddenDiv('variantURL', window.location.href);
    }
  });
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: cleanUp,
    domain: 'flipkart.com',
    zipcode: "''",
  },
  implementation,
};
