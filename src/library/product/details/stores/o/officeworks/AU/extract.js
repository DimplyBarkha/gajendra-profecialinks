const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    transform: cleanUp,
    domain: 'officeworks.com.au',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const alternateImg = document.querySelectorAll('div[aria-hidden=true] div[class*=ImageZoom] img[hide="1"]');
      alternateImg.forEach(element => {
        addElementToDocument('alternateImg', `https:${element.getAttribute('src')}`);
      });

      const specTabs = document.querySelectorAll('li[class*=SpecificationsTab__SpecsListItem]');
      let specArr = [];
      specTabs.forEach(element => {
        specArr.push(element.innerText);
      });
      addElementToDocument('product-spec', specArr.join(' || ').trim());

      const availability = document.querySelector('meta[itemprop="availability"][content="http://schema.org/InStock"]') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);

      const variantPackQty = document.querySelectorAll('a[data-ref*=family-pack]').length !== 0 ? document.querySelectorAll('a[data-ref*=family-pack]').length : 1;
      const variantColor = document.querySelectorAll('div[data-ref*=family-colour] a').length !== 0 ? document.querySelectorAll('div[data-ref*=family-colour] a').length : 1;
      const variantSize = document.querySelectorAll('a[data-ref*=family-size]').length !== 0 ? document.querySelectorAll('a[data-ref*=family-size]').length : 1;
      const variantCount = variantPackQty * variantColor * variantSize;
      addElementToDocument('variantCount', variantCount);

      let variantsArr = [];
      if (variantPackQty > 1) {
        document.querySelectorAll('a[data-ref*=family-pack]').forEach(element => {
          variantsArr.push(`Pack Quantity: ${element.innerText}`);
        });
      }
      if (variantColor > 1) {
        document.querySelectorAll('div[data-ref*=family-colour] a').forEach(element => {
          variantsArr.push(`Colour: ${element.innerText}`);
        });
      }
      if (variantSize > 1) {
        document.querySelectorAll('a[data-ref*=family-size]').forEach(element => {
          variantsArr.push(`Size: ${element.innerText}`);
        });
      }
      addElementToDocument('variants', variantsArr.join(' || '));
    });
    await context.extract(productDetails, { transform });
  },
};
