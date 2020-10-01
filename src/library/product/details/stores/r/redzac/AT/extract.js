const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    transform: cleanUp,
    domain: 'redzac.at',
    zipcode: '',
  },

  implementation: async (
    { inputString },
    { country, domain },
    context,
    { productDetails },
  ) => {
    await context.waitForSelector(
      '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
    );
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // adding image to DOM
      let image = '';
      if (
        document.querySelector(
          '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
        )
      ) {
        image = document.querySelector(
          '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
        ).srcset;
        const end = image.lastIndexOf(' ');
        const beginning = image.substr(0, end).lastIndexOf(' ');
        image = `https://www.redzac.at${image.substring(
                    beginning + 1,
                    end,
                )}`;
      }
      if (image) addElementToDocument('image', image);

      // adding specifications to DOM
      const dataCell = document.querySelectorAll('td.data_cell') ? document.querySelectorAll('td.data_cell') : '';
      let specifications = '';
      if (dataCell) {
        dataCell.forEach((elem, index, data) => {
          if (elem.innerText === 'Breite (cm)' || elem.innerText === 'Höhe (cm)' || elem.innerText === 'Tiefe (cm)') {
            specifications += `${elem.innerHTML} ${data[index + 1].innerHTML}`;
          }
        });
      }
      if (specifications) addElementToDocument('specifications', specifications);

      // adding manufacturerImages to the DOM

      const manufacturerImgs = document.querySelectorAll(
        '#dyson_jump_features  div.inpage_ftgridimg',
      )
        ? document.querySelectorAll(
          '#dyson_jump_features  div.inpage_ftgridimg img',
        )
        : '';
      manufacturerImages = [];
      manufacturerImgs.forEach(img => { manufacturerImages.push('https:' + img.srcset); });

      if (manufacturerImages) addElementToDocument('manufacturerImages', manufacturerImages.toString());
    });
    await context.extract(productDetails);
  },
};
