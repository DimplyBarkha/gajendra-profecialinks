
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Getting specifications
      document.querySelector('.js-toggle-collapsed').click();
      let specifications = '';
      document.querySelectorAll('dl.specification').forEach(specificationGroup => {
        specifications += `${specificationGroup.innerText}\n`;
      });
      addElementToDocument('mm_specifications', specifications);

      const imageUrl = `https:${document.querySelector('img.img-preview').attributes.src.value}`;
      addElementToDocument('mm_imageUrl', imageUrl);
    });
    await context.extract(productDetails);
  },
};
