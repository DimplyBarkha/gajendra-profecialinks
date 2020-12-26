const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
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

      const urlParams = new URLSearchParams(window.location.search);

      const specificationsButton = document.querySelector('.js-toggle-collapsed');
      if (specificationsButton) {
        specificationsButton.click();
      }

      // Getting specifications, size
      let specifications = '';
      let weight = '';
      let color = '';
      let warranty = '';
      let mpc = '';
      let energy = '';
      document.querySelectorAll('dl.specification').forEach(specificationGroup => {
        var specificationsItems = Array.from(specificationGroup.children);
        specificationsItems.forEach((item, index) => {
          // Getting weight
          if (item.innerText === 'Gewicht:') {
            weight = specificationsItems[index + 1].innerText;
          }
          // Getting color
          if (item.innerText === 'Kleur:') {
            color = specificationsItems[index + 1].innerText;
          }
          // Getting warranty
          if (item.innerText === 'Fabrieksgarantie:') {
            warranty = specificationsItems[index + 1].innerText;
          }
          // Getting mpc
          if (item.innerText === 'Manufacturer Part Number (MPN):') {
            mpc = specificationsItems[index + 1].innerText;
          }
          // Getting energy
          if (item.innerText === 'Energie-efficiëntieklasse:') {
            energy = specificationsItems[index + 1].innerText;
          }
        });
      });
      addElementToDocument('mm_weight', weight);
      addElementToDocument('mm_color', color);
      addElementToDocument('mm_warranty', warranty);
      addElementToDocument('mm_mpc', mpc);
      addElementToDocument('mm_energy', energy);

      // Gets all specifications
      const specificationsElement = document.querySelector('#features');
      if (specificationsElement) {
        addElementToDocument('mm_specifications', specificationsElement.textContent.replace(/\r?\n/g, ' ').slice(0, -1).replace(/\s+|\s+/g, ' ').trim());
      }

      // Getting sku code
      const sku = urlParams.get('ga_query');
      addElementToDocument('mm_skuCode', sku);
      addElementToDocument('mm_retailerProductCode', sku);

      // Getting number of customer reviews
      const reviewsElement = document.querySelector('.bv_numReviews_text');
      if (reviewsElement) {
        addElementToDocument('mm_numberOfCustomerReviews', reviewsElement.innerText.replace(/\(|\)/g, ''));
      }

      // Gets aggregate rating
      if (document.querySelector('div[itemprop=ratingValue]')) {
        addElementToDocument('mm_aggregateRating', document.querySelector('div[itemprop=ratingValue]').innerText.replace('.', ','));
      }

      // Getting images
      const images = Array.from(document.querySelectorAll('ul.thumbs li a:not(.thumb--play-video-btn)'));
      const image = `https:${images[0].dataset.preview}`;
      const alternativeImages = images.reduce((accumulator, link, i) => i > 0 ? accumulator + `${i !== 1 ? ' | ' : ''}https:${link.dataset.preview}` : '', '');
      addElementToDocument('mm_image', image);
      addElementToDocument('mm_alternateImages', alternativeImages);

      // Getting category
      const breadcrumbs = Array.from(document.querySelectorAll('ul.breadcrumbs li a'));
      addElementToDocument('mm_category', breadcrumbs[1].innerText);

      // Getting subcategory
      const subcategories = breadcrumbs.reduce((accumulator, category, i) => i > 1 ? accumulator + `${i > 2 ? ' > ' : ''}${category.innerText}` : '', '');
      addElementToDocument('mm_subCategory', subcategories);

      // Checking if in stock
      if (document.querySelector('.label-instock')) {
        addElementToDocument('mm_availabilityText', 'In Stock');
      }

      // Checking if image zoom feature present
      if (document.querySelector('.zoom')) {
        addElementToDocument('mm_imageZoomFeaturePresent', 'Yes');
      }

      // Getting base url
      addElementToDocument('mm_baseUrl', document.querySelector('link[rel=canonical]').href);

      // Getting description
      const descriptionElement = Array.from(document.querySelectorAll('#omschrijving p'));
      if (descriptionElement) {
        addElementToDocument('mm_description', descriptionElement.map(element => element.innerText.replace(/\r?\n/g, ' ').slice(0, -1)).join(' '));
      }
    });
    await context.extract(productDetails);
  },
};
