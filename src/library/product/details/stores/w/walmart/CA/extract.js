const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v2']")) ? document.querySelectorAll("button[class*='e30m82v2']").length : 0;
  });
  const variantColorLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v2']")) ? document.querySelectorAll("button[class*='e30m82v2']").length : 0;
  });

  const variantSizeLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v3']")) ? document.querySelectorAll("button[class*='e30m82v3']").length : 0;
  });

  if (variantColorLength !== 0 && variantSizeLength !== 0) {
    variantLength = variantColorLength * variantSizeLength;
  } else {
    variantLength = variantColorLength === 0 ? variantSizeLength : variantColorLength;
  }

  async function preparePage (index, variantLength, variantColorLength, variantSizeLength) {
    await context.evaluate(async (index, variantLength, variantColorLength, variantSizeLength) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let firstVariant = '';
      const productData = window.__PRELOADED_STATE__;
      if (productData) {
        let totalVariant = Object.keys(productData.entities.skus).length;
        console.log('variantColorLength', variantColorLength, variantSizeLength);
        if (variantColorLength === 0 && variantSizeLength === 0) {
          totalVariant = 0;
        } else {
          firstVariant = productData.product.activeSkuId;
          addHiddenDiv('ii_firstVariant', firstVariant);
          const variants = productData.product.item.skus;
          console.log('productData.product.skus.length', productData, productData.product, productData.product.skus)
          addHiddenDiv('ii_variants', variants);
        }
        console.log('totalVariant', totalVariant);
        addHiddenDiv('ii_totalvariant', totalVariant);
        const rating = productData.product.item.rating.averageRating;
        addHiddenDiv('ii_rating', rating);
      }
    }, index, variantLength, variantColorLength, variantSizeLength);
  }

  console.log(variantLength, variantColorLength, variantSizeLength);

  if (variantLength > 1) {
    if (variantColorLength && variantSizeLength) {
      for (let index = 0; index < variantColorLength; index++) {
        await context.click(`button[class*='e30m82v2']:nth-child(${index + 1})`);
        for (let j = 0; j < variantSizeLength; j++) {
          await context.click(`button[class*='e30m82v3']:nth-child(${j + 1})`);
          if (index <= variantLength - 2) {
            console.log('Inside variants', index);
            await preparePage(index, variantLength);
            await context.extract(productDetails, { transform }, { type: 'APPEND' });
          }
        }
      }
    }
    if (variantSizeLength === 0) {
      for (let index = 0; index < variantColorLength; index++) {
        await context.click(`button[class*='e30m82v2']:nth-child(${index + 1})`);
        if (index <= variantLength - 2) {
          console.log('Inside variants', index);
          await preparePage(index, variantLength);
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      }
    }
    if (variantColorLength === 0) {
      for (let index = 0; index < variantSizeLength; index++) {
        await context.click(`button[class*='e30m82v3']:nth-child(${index + 1})`);
        if (index <= variantLength - 2) {
          console.log('Inside variants', index);
          await preparePage(index, variantLength, variantColorLength, variantSizeLength);
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      }
    }
  }

  if (variantLength) {
    await preparePage(variantLength - 1, variantLength, variantColorLength, variantSizeLength);
  } else {
    await preparePage(0, 0, variantColorLength, variantSizeLength);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
