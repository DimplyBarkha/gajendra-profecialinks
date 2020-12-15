const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const data = [];

  const variantCount = await context.evaluate(async function () {
    return document.querySelector('.product-options') ? document.querySelectorAll('.product-options .option').length : 0;
  });

  if (variantCount !== 0) {
    for (let i = 0; i < variantCount; i++) {
      await context.click(`.product-options .option:nth-of-type(${i + 1})`);
      await context.evaluate(async function () {
        function addElementToDom (element, id) {
          const div = document.createElement('div');
          div.id = id;
          div.innerHTML = element;
          document.querySelector('body').appendChild(div);
        }

        const brandText = document.querySelector('.product-shop .product-name .product-brand')
          ? document.querySelector('.product-shop .product-name .product-brand').innerText
          : '';
        const shortName = document.querySelector('.product-shop .product-name .h1') ? document.querySelector('.product-shop .product-name .h1').innerText : '';

        let nameExtended = shortName;
        if (brandText && shortName && !shortName.toLowerCase().includes(brandText.toLowerCase())) {
          nameExtended = `${brandText} - ${shortName}`;
        }
        addElementToDom(nameExtended, 'nameExtended');
        addElementToDom(brandText, 'brandText');

        let quantity = document.querySelector(".descr .product-tabs:nth-of-type(1) div[itemprop='description'] p:nth-of-type(1)")
          ? document.querySelector(".descr .product-tabs:nth-of-type(1) div[itemprop='description'] p:nth-of-type(1)").innerText
          : '';
        const quantityRegex = /\d*x\d*.*$/g;
        if (quantity && quantityRegex.test(quantity)) {
          quantity = quantity.match(quantityRegex)[0].split('x')[0];
        } else {
          quantity = '1';
        }
        addElementToDom(quantity, 'quantity');

        const warningText = document.querySelector('.descr .product-tabs:nth-of-type(3) div hr')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:last-of-type')
            ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:last-of-type').innerText
            : ''
          : document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)')
            ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)').innerText
            : '';
        addElementToDom(warningText, 'warningText');

        const variantCount = document.querySelector('.product-options') ? document.querySelectorAll('.product-options .option').length : 0;
        addElementToDom(variantCount, 'variantCount');

        const variants = document.querySelector('.product-options') ? document.querySelectorAll('.product-options .option') : [];
        const variantsTable = [];
        variants.forEach((variant) => {
          const varInfo = variant.querySelector('.info-bulle .legend').innerHTML.split('&nbsp;')[1];
          variantsTable.push(varInfo);
        });
        addElementToDom(variantsTable.join(','), 'variants');

        const variantInfo = document.querySelector('.product-options h3') ? document.querySelector('.product-options h3').innerText.trim().replace(':', '') : '';
        addElementToDom(variantInfo, 'variantInfo');

        if (variantCount !== 0 && variantInfo.toLowerCase().includes('couleur')) {
          const color = document.querySelector('.product-options .option.active .info-bulle .legend').innerHTML.split('&nbsp;')[1];
          addElementToDom(color, 'color');
        }

        const productOtherInfoTable = document.querySelector('.descr .product-tabs:nth-of-type(2) p') ? document.querySelectorAll('.descr .product-tabs:nth-of-type(2) p') : [];
        const productOtherInfoTableText = [];
        productOtherInfoTable.forEach((item) => {
          productOtherInfoTableText.push(item.innerText);
        });
        addElementToDom(productOtherInfoTableText.join('\n'), 'productOtherInfo');

        const productComposition = document.querySelector('.descr .product-tabs:nth-of-type(3) div hr')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:not(last-of-type)')
            ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:not(last-of-type)').innerText
            : ''
          : document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)')
            ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)').innerText
            : '';
        addElementToDom(productComposition, 'productComposition');
      });
      const extract = await context.extract(productDetails, { transform });
      data.push(extract);
      await context.evaluate(async function () {
        const elementsIds = ['nameExtended', 'brandText', 'quantity', 'warningText', 'variantCount', 'variantInfo', 'color', 'productOtherInfo', 'productComposition', 'variants'];

        elementsIds.forEach((elemId) => {
          const element = document.querySelector(`div#${elemId}`);
          element.parentNode.removeChild(element);
        });
      });
    }
    return data;
  } else {
    await context.evaluate(async function () {
      function addElementToDom (element, id) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.querySelector('body').appendChild(div);
      }

      const brandText = document.querySelector('.product-shop .product-name .product-brand') ? document.querySelector('.product-shop .product-name .product-brand').innerText : '';
      const shortName = document.querySelector('.product-shop .product-name .h1') ? document.querySelector('.product-shop .product-name .h1').innerText : '';

      let nameExtended = shortName;
      if (brandText && shortName && !shortName.toLowerCase().includes(brandText.toLowerCase())) {
        nameExtended = `${brandText} - ${shortName}`;
      }
      addElementToDom(nameExtended, 'nameExtended');
      addElementToDom(brandText, 'brandText');

      let quantity = document.querySelector(".descr .product-tabs:nth-of-type(1) div[itemprop='description'] p:nth-of-type(1)")
        ? document.querySelector(".descr .product-tabs:nth-of-type(1) div[itemprop='description'] p:nth-of-type(1)").innerText
        : '';
      const quantityRegex = /\d*x\d*.*$/g;
      if (quantity && quantityRegex.test(quantity)) {
        quantity = quantity.match(quantityRegex)[0].split('x')[0];
      } else {
        quantity = '1';
      }
      addElementToDom(quantity, 'quantity');

      const warningText = document.querySelector('.descr .product-tabs:nth-of-type(3) div hr')
        ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:last-of-type')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:last-of-type').innerText
          : ''
        : document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)').innerText
          : '';
      addElementToDom(warningText, 'warningText');

      const variantCount = document.querySelector('.product-options') ? document.querySelectorAll('.product-options .option').length : 0;
      addElementToDom(variantCount, 'variantCount');

      const productOtherInfoTable = document.querySelector('.descr .product-tabs:nth-of-type(2) p') ? document.querySelectorAll('.descr .product-tabs:nth-of-type(2) p') : [];
      const productOtherInfoTableText = [];
      productOtherInfoTable.forEach((item) => {
        productOtherInfoTableText.push(item.innerText);
      });
      addElementToDom(productOtherInfoTableText.join('\n'), 'productOtherInfo');

      const productComposition = document.querySelector('.descr .product-tabs:nth-of-type(3) div hr')
        ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:not(last-of-type)')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:not(last-of-type)').innerText
          : ''
        : document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)')
          ? document.querySelector('.descr .product-tabs:nth-of-type(3) div p:nth-of-type(1)').innerText
          : '';
      addElementToDom(productComposition, 'productComposition');
    });
    return await context.extract(productDetails, { transform });
  }
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    transform: cleanUp,
    domain: 'easyparapharmacie.com',
    zipcode: '',
  },
  implementation,
};
