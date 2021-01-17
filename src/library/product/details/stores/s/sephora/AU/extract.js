const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform,
    domain: 'sephora.com.au',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(function () {
      document.cookie = 'locale=au;';
    });

    const nameExtended = await context.evaluate(function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('ii_parentInput', parentInput);
      const name = [];
      const variant = '//span[contains(@class, "current-variant-name")]';
      const names = '//div[@class="basic-information-section"]//div[contains(@class, "product-")]';
      const directions = '//div[contains(@class, "how-to")]//text()';
      const directionBullets = '//div[contains(@class, "how-to")]//li';
      const description = '//div[contains(@class, "product-description")]//text()';
      const descriptionBullets = '//div[contains(@class, "product-description")]//li';
      var directionsBCheck = document.evaluate(directionBullets, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck = document.evaluate(descriptionBullets, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck = document.evaluate(directions, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck = document.evaluate(description, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck = document.evaluate(variant, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck = document.evaluate(names, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      if (namesCheck.snapshotLength > 0) {
        const checkName1 = namesCheck.snapshotItem(0);
        const checkName2 = namesCheck.snapshotItem(1);
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

      if (directionsCheck.snapshotLength > 0) {
        const fullDir = [];
        for (let i = 0; i < directionsCheck.snapshotLength; i++) {
          let line = directionsCheck.snapshotItem(i).textContent;
          console.log('HERE123' + line);
          if (directionsBCheck.snapshotLength > 0) {
            for (let i = 0; i < directionsBCheck.snapshotLength; i++) {
              if (line.includes(directionsBCheck.snapshotItem(i).textContent)) {
                line = ` || ${line}`;
              }
            }
          }
          fullDir.push(line);
        }
        const joins = fullDir.join(' ');
        addHiddenDiv('ii_directions', joins);
      }

      if (descriptionCheck.snapshotLength > 0) {
        const fullDesc = [];
        for (let i = 0; i < descriptionCheck.snapshotLength; i++) {
          let line = descriptionCheck.snapshotItem(i).textContent;
          if (descriptionBCheck.snapshotLength > 0) {
            for (let i = 0; i < descriptionBCheck.snapshotLength; i++) {
              if (line.includes(descriptionBCheck.snapshotItem(i).textContent)) {
                line = ` || ${line}`;
              }
            }
          }
          fullDesc.push(line);
        }
        const joins = fullDesc.join(' ');
        addHiddenDiv('ii_description', joins);
      }
    }, parentInput);

    // await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform: transformParam });
  },
};
