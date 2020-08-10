const { transform } = require('./format');
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Formatting alternate images
    const imageLinksArray = [];
    const altImagesSelector = document.querySelectorAll('ul[class="swiper-wrapper"] > li img');
    for (let i = 0; i < altImagesSelector.length; i++) {
      const node = altImagesSelector[i];
      if (node.getAttribute('data-fancybox-src')) {
        imageLinksArray.push(node.getAttribute('data-fancybox-src'));
      }
    }
    const alternateImageText = imageLinksArray.join(' | ');
    if (alternateImageText) addHiddenDiv('ii_alternateImages', alternateImageText);

    // Formatting list price
    const listPriceSelector = document.querySelector('div[class*="price-container"] span[id*="old-price"]');
    let listPrice = listPriceSelector ? listPriceSelector.innerText : '';
    listPrice = listPrice ? listPrice.replace('au lieu de ', '') : '';
    if (listPrice) addHiddenDiv('ii_listPrice', listPrice);

    // Getting description bullets
    const descriptionBulletSelector = document.querySelectorAll('div[class="description-container"] div[class="std"] ul li');
    const descriptionBullet = descriptionBulletSelector.length ? descriptionBulletSelector.length : '';
    if (descriptionBullet) addHiddenDiv('ii_descriptionBullet', descriptionBullet);

    // Getting values from product description
    const descriptionSelector = document.querySelector('div[class="description-container"] div[class="std"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    if (description) addHiddenDiv('ii_description', description);

    const descriptionArray = description.split('\n');
    const newLineRemovedDescription = description.replace(/(\r\n|\n|\r)/gm, '');

    const quantity = descriptionArray[descriptionArray.length - 1];
    if (listPrice) addHiddenDiv('ii_quantity', quantity);

    const directionsRegex = /.*?Conseils d'utilisation :(.*?)\w* :.*/gm;
    const directions = newLineRemovedDescription.replace(directionsRegex, '$1');
    if (directions !== newLineRemovedDescription) addHiddenDiv('ii_directions', directions);

    const warningsRegex = /.*?Attention :(.*)Polysorbate.*/gm;
    const warnings = newLineRemovedDescription.replace(warningsRegex, '$1');
    if (warnings !== newLineRemovedDescription) addHiddenDiv('ii_warnings', warnings);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    transform,
    domain: 'santediscount.com',
  },
  implementation,
};
