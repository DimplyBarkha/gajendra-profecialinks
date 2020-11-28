
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

      let urlParams = new URLSearchParams(window.location.search);

      // Getting specifications, size
      let specifications = '';
      let size = '';
      let weight = '';
      document.querySelectorAll('dl.specification').forEach(specificationGroup => {
        specifications += `${specificationGroup.innerText}\n`;
        specificationGroup.children.forEach((item, index) => {
          console.log(item, item.innerText);
          // Getting size
          if (item.innerText === 'Afmetingen (B/H/D):' || item.innerText === 'Afmetingen (B x H x D):' || item.innerText === 'Inhoud:') {
            size = specificationGroup.children[index + 1].innerText;
          }
          // Getting weight
          if (item.innerText === 'Gewicht:') {
            weight = specificationGroup.children[index + 1].innerText;
          }
        });
      });
      addElementToDocument('mm_specifications', specifications);
      addElementToDocument('mm_size', size);
      addElementToDocument('mm_weight', weight);

      // Getting upc code
      let upc = eval(`window.product${urlParams.get('ga_query')}.ean`);
      addElementToDocument('mm_upc', upc);

      // Getting sku code
      let sku = urlParams.get('ga_query');
      addElementToDocument('mm_skuCode', sku);
      addElementToDocument('mm_retailerProductCode', sku);

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
