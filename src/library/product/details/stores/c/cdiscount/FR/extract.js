const { transform } = require('../format.js');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    console.log('page is loaded successfully....executing scrolling code');
    // Scrolling till specifications as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 10000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('div[id="presContent"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div[id="descContent"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }
    await scrollToLoadAplusImages();
    console.log('scrolling code execution complete.....');

    // If images are present in description then add to manufacturerDescription else add to description
    let manufacturerImageFlag = document.querySelector('div[id="inpage_container"] img');
    manufacturerImageFlag = manufacturerImageFlag || document.querySelector('div[id*="presContent"] img');
    let descriptionSelector = document.querySelector('div[id="inpage_container"]');
    descriptionSelector = descriptionSelector || document.querySelector('div[id*="presContent"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description ? description.replace(/(\n\s*){1,}/g, ' || ') : '';

    // description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.fr',
    zipcode: "''",
  },
  implementation,
};
