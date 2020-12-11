
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
    await context.click('.js-toggle-collapsed');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const urlParams = new URLSearchParams(window.location.search);

      // Getting specifications, size
      let specifications = '';
      let weight = '';
      let color = '';
      let warranty = '';
      let mpc = '';
      let energy = '';
      let packSize = '';
      document.querySelectorAll('dl.specification').forEach(specificationGroup => {
        specifications += `${specificationGroup.innerText}\n`;
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
          // Pack size
          if (item.innerText === 'Verpakkingsinhoud:') {
            packSize = specificationsItems[index + 1].innerText;
          }
        });
      });
      addElementToDocument('mm_specifications', specifications);
      addElementToDocument('mm_size', size);
      addElementToDocument('mm_weight', weight);
      addElementToDocument('mm_color', color);
      addElementToDocument('mm_warranty', warranty);
      addElementToDocument('mm_mpc', mpc);
      addElementToDocument('mm_energy', energy);
      addElementToDocument('mm_packSize', packSize);

      // Getting upc code
      if (eval(`window.product${urlParams.get('ga_query')}`)) {
        const upc = eval(`window.product${urlParams.get('ga_query')}.ean`);
        addElementToDocument('mm_upc', upc);
      }

      // Getting sku code
      const sku = urlParams.get('ga_query');
      addElementToDocument('mm_skuCode', sku);
      addElementToDocument('mm_retailerProductCode', sku);

      // Getting number of customer reviews
      const reviews = document.querySelector('.bv_numReviews_text').innerText.replace(/\(|\)/g, '');
      addElementToDocument('mm_numberOfCustomerReviews', reviews);

      // Gets aggregate rating
      if (document.querySelector('div[itemprop=ratingValue]')) {
        addElementToDocument('mm_aggregateRating', document.querySelector('div[itemprop=ratingValue]').innerText.replace('.', ','));
      }

      // Getting images
      const images = Array.from(document.querySelectorAll('ul.thumbs li a:not(.thumb--play-video-btn)'));
      const image = `https:${images[0].dataset.magnifier}`;
      const alternativeImages = images.reduce((accumulator, link, i) => i > 0 ? accumulator + `${i !== 1 ? ' | ' : ''}https:${link.dataset.magnifier}` : '', '');
      addElementToDocument('mm_image', image);
      addElementToDocument('mm_alternateImages', alternativeImages);

      // Getting category
      const breadcrumbs = Array.from(document.querySelectorAll('ul.breadcrumbs li a'));
      addElementToDocument('mm_category', breadcrumbs[1].innerText);

      // Getting subcategory
      addElementToDocument('mm_subCategory', `${breadcrumbs[2].innerText}${breadcrumbs[3] && ' > ' + breadcrumbs[3].innerText}`);

      // Checking if in stock
      if (document.querySelector('.label-instock')) {
        addElementToDocument('mm_availabilityText', 'In Stock');
      }

      // Checking if image zoom feature present
      if (document.querySelector('.zoom')) {
        addElementToDocument('mm_imageZoomFeaturePresent', 'Yes');
      }

      // Getting base url
      if (window) {
        addElementToDocument('mm_baseUrl', window.location.href);
      }
    });
    await context.extract(productDetails);
  },
};
