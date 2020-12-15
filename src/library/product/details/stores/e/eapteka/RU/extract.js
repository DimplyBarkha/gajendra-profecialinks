const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    transform: cleanUp,
    domain: 'eapteka.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const addedElem = document.createElement('div');
      addedElem.id = 'added_elem';

      const productName = document.querySelector('div.new-offer-box h1') ? document.querySelector('div.new-offer-box h1').textContent : '';
      const quantity = productName.match(/(\d+) шт.*?$/) ? productName.match(/(\d+) шт.*?$/)[1] : '';
      const packSize = productName.match(/(\d+)х\d+ шт.*?$/) ? productName.match(/(\d+)х\d+ шт.*?$/)[1] : '';

      addedElem.setAttribute('quantity', quantity);
      addedElem.setAttribute('pack_size', packSize);

      const warningsElements = document.querySelectorAll('div#instruction_PREGNANCY_USE, div#instruction_CONTRAINDICATIONS, div#instruction_SIDE_EFFECTS, div#instruction_INTERACTION, div#instruction_OVERDOSE');
      const warnings = Array.from(warningsElements).map(elem => elem.textContent).join(' | ');

      addedElem.setAttribute('warnings', warnings);

      const ratingElem = document.querySelector('div.offer-card__rating div.rating');
      const rating = ratingElem && ratingElem.getAttribute('class').match(/rating s(\d+)/) ? ratingElem.getAttribute('class').match(/rating s(\d+)/)[1] : '';
      addedElem.setAttribute('aggregate_rating', rating);

      const manufacturerImagesList = document.createElement('ul');
      manufacturerImagesList.id = 'added_manufacturer_images';
      manufacturerImagesList.style.display = 'none';

      const manufacturerImages = document.querySelectorAll('div#bcertificates a');
      for (let i = 0; i < manufacturerImages.length; i++) {
        const url = manufacturerImages[i].getAttribute('href');
        if (url) {
          const listItem = document.createElement('li');
          listItem.textContent = url;
          manufacturerImagesList.appendChild(listItem);
        }
      }

      document.body.appendChild(manufacturerImagesList);
      document.body.appendChild(addedElem);
    });

    await context.extract(productDetails, { transform });
  },
};
