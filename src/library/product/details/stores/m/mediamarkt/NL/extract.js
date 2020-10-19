
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

      // Getting images
      const images = document.querySelectorAll('ul.thumbs li a:not(.thumb--play-video-btn)');
      const image = `https:${images[0].dataset.magnifier}`;
      let alternativeImages = '';
      images.forEach((link, i) => {
        if (i > 0) {
          alternativeImages += `${i !== 1 ? ' | ' : ''}https:${link.dataset.magnifier}`;
        }
      });
      addElementToDocument('mm_image', image);
      addElementToDocument('mm_alternateImages', alternativeImages);

      // Getting category
      let category = '';
      document.querySelectorAll('ul.breadcrumbs li a').forEach((item, i) => {
        category += `${i !== 0 ? ' > ' : ''}${item.innerText}`;
      });
      addElementToDocument('mm_category', category);

      // Checking if in stock
      if (document.querySelector('.label-instock')) {
        addElementToDocument('mm_availabilityText', 'In Stock');
      }

      // Checking if image zoom feature present
      if (document.querySelector('.zoom')) {
        addElementToDocument('mm_imageZoomFeaturePresent', 'Yes');
      }
    });
    await context.extract(productDetails);
  },
};
