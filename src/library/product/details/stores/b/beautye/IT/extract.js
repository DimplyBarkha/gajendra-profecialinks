const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  // await context.evaluate(async () => {
  //   function addHiddenDiv (id, content) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     document.body.appendChild(newDiv);
  //   }

  //   const parent = document.evaluate('//div[contains(@class, "product data") and contains(@role,"tablist")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //   if (parent) {
  //     const children = parent.children;
  //     const headersArr = []; 
  //     const textArr = []; 
  //     for (let i = 0; i < children.length; i++) {
  //       // const text = children[i].textContent;
  //       if (i %2 === 0) {
  //         const header = children[i].children[0].children[0].textContent;
  //         if (header.indexOf('Consigli') > -1) {
  //           const adviceTxt = children[i+1].textContent.trim();
  //           addHiddenDiv('my-info-direction', adviceTxt);
  //         } else if (header.indexOf('Ingredienti') > -1) {
  //           const IngredientTxt = children[i+1].textContent.trim();
  //           addHiddenDiv('my-info-ingredient', IngredientTxt);
  //         } else if (header.indexOf('Descrizione') > -1) {
  //           const descTxt = children[i+1].textContent.trim();
  //           addHiddenDiv('my-info-desc', descTxt);
  //         }
  //       }
  //     }
  //     return [`Children count is ${children.length}`, headersArr, textArr];
  //   }
  // });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.swatch-attribute-options div.swatch-option')) ? document.querySelectorAll('div.swatch-attribute-options div.swatch-option').length : 0;
  });
  console.log("variantLength:: ", variantLength);
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      try {
        try {
          await context.evaluate( (j) => {
            return document.querySelectorAll('div.swatch-option')[j].click();
          }, j);
          console.log('Inside variants', j);
        } catch (err) {}
        if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
      } catch (err) {}
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    transform: transform,
    domain: 'beautye.it',
    zipcode: "''",
  },
  implementation,
};
