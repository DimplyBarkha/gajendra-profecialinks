const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mercadona',
    transform,
    domain: 'mercadona.es',
    zipcode: '46008',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // const setZipcode = async () => {
    //   await context.setInputValue('input[name="postalCode"]', '46008');
    //   await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    //   await context.click('button.button-big');
    // };
    // await context.evaluate(async function () {
    //   const isPublic = document.querySelector('.public-product-detail');
    //   if (isPublic) {
    //     await setZipcode();
    //   }
    // });

    try {
      await context.setInputValue('input[name="postalCode"]', '46008');
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.click('button.button-big');
    } catch (e) {
      console.log(e);
    }

    await context.waitForSelector('.private-product-detail');
    await context.evaluate(() => {
      function addHiddenDiv (className, content, node) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        node.appendChild(newDiv);
      }

      const currentProduct = document.querySelector('.private-product-detail__content');
      // const zipcodeInput = document.querySelector('.input-text__label')?.nextElementSibling;
      const headLinesOfProduct = document.querySelectorAll('.headline1-r');
      const pricePerUnit = headLinesOfProduct[headLinesOfProduct.length - 1];
      const packSize = headLinesOfProduct[headLinesOfProduct.length - 2]
        .textContent
        .match(/\d{0,} ud./);

      // console.log(zipcodeInput);

      // if (zipcodeInput) {
      //   const submitBtn = document.querySelector('.button');
      //   console.log(submitBtn);
      //   zipcodeInput.value = '46008';
      //   submitBtn.click();
      // }

      if (currentProduct) {
        if (packSize) {
          const size = packSize[0].replace(/[^0-9]/g, '');
          addHiddenDiv('helper-pack-size', size, currentProduct);
        } else {
          addHiddenDiv('helper-pack-size', 'null', currentProduct);
        }
        addHiddenDiv('helper-product-url', location.href, currentProduct);
        addHiddenDiv('price-per-unit', pricePerUnit.textContent, currentProduct);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
