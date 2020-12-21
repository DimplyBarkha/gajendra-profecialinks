const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sephora',
    transform,
    domain: 'sephora.ae',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const scrollFunc = await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 2000;
        window.scroll(0, scrollTop);
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('SCROLLING');
        if (scrollTop === 20000) {
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));

    const nameExtended = await context.evaluate(function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('ii_parentInput', parentInput);
      addHiddenDiv('ii_url', window.location.href);

      const variant = '//span[contains(@class, "selected-value-name")]';
      const brandName = '//span[contains(@class,"brand-name")]';
      const prodName = '//span[contains(@class, "product-name")]';
      const manufImages = '//div[contains(@class, "brand-content-block")]//img//@src';
      var manufImageCheck = document.evaluate(manufImages, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck = document.evaluate(variant, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var brandNameCheck = document.evaluate(brandName, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var prodNameCheck = document.evaluate(prodName, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      if (brandNameCheck.snapshotLength > 0) {
        const name = [];
        const checkName1 = brandNameCheck.snapshotItem(0);
        const checkName2 = prodNameCheck.snapshotItem(0);
        const checkVariant = variantCheck.snapshotItem(0);
        if (checkName1) {
          name.push(checkName1.textContent);
        }
        if (checkName2) {
          name.push(checkName2.textContent);
        }
        if (checkVariant) {
          name.push(checkVariant.textContent);
        }

        const fullName = name.join(' - ');

        addHiddenDiv('ii_nameExtended', fullName);
      }

      if (manufImageCheck.snapshotLength > 0) {
        for (let i = 0; i < manufImageCheck.snapshotLength; i++) {
          const image = manufImageCheck.snapshotItem(i).textContent;
          addHiddenDiv('ii_manufImage', image);
        }
      }
    }, parentInput);
    return await context.extract(productDetails, { transform: transformParam });
  },

};
