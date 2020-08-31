
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform: null,
    domain: 'sephora.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;

  const variantArray = await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const element = document.querySelectorAll("script[type='application/ld+json']");
    let variantObj;
    const variantSkuArray = [];
    if (element.length > 0) {
      for (let i = 0; i < element.length; i++) {
        const variantText = element[i].innerText;
        if (variantText.includes('sku')) {
          const varObj = JSON.parse(variantText);
          if (varObj) {
            variantObj = varObj;
          }
        }
      }
    }
    if (variantObj) {
      if (variantObj.offers) {
        for (let j = 0; j < variantObj.offers.length; j++) {
          if (variantObj.offers[j].sku) {
            // addHiddenDiv(`ii_variants`, variantObj.offers[j].sku);

            variantSkuArray.push(variantObj.offers[j].sku);
          }
        }
      }
    }
    if (variantSkuArray.length) {
      // debugger
      return variantSkuArray;
    } else {
      return null;
    }
  });

  if (variantArray) {
    for (let i = 0; i < variantArray.length; i++) {
      // await context.goto(`https://www.sephora.com/search?keyword=${variantArray[i]}`, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      // await new Promise(resolve => setTimeout(resolve, 5000));
      const addSkuArray = await context.evaluate(function (variantArray, i) {
        // let variantStr = variants.join(" | ")
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('ii_variantUrl', `https://www.sephora.com/search?keyword=${variantArray[i]}`);

        addHiddenDiv('ii_variant', `${variantArray[i]}`);
      }, variantArray, i);
    }
  }

  return await context.extract(variants, { transform });
}
