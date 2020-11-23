const { transform } = require('./shared');

async function implementation (
  { results },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function (results) {
    function addHiddenDiv (id, content, container) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      container.appendChild(newDiv);
    }

    const productCards = document.querySelectorAll('div[class*="viewports-enabled-fop__"]');
    if (productCards && productCards.length > 0) {
      const length = (productCards.length > results) ? results : productCards.length;
      for (let i = 0; i < length; i++) {
        if ((i % 5) === 3) {
          productCards[i].scrollIntoView({ behavior: 'smooth' });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        const thumbnail = productCards[i].querySelector('a[data-synthetics="bop-link"] img');
        if (thumbnail) {
          addHiddenDiv('ii_thumbnail', thumbnail.getAttribute('src'), productCards[i]);
        }
        const loadedCards = productCards[i].querySelector('div[class*="base__BoxCard"]');
        if (!loadedCards) {
          productCards[i].scrollIntoView({ behavior: 'smooth' });
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  }, results);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    transform,
    domain: 'casinodrive.fr',
    zipcode: '',
  },
  implementation,
};
