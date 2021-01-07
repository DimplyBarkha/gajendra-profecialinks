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
    const descriptionSelector = document.querySelectorAll('div[id="inpage_container"], div[id*="presContent"]');
    let description = '';
    descriptionSelector && descriptionSelector.forEach(element => {
      // @ts-ignore
      description += element.innerText;
    });
    try {
      // @ts-ignore
      const video = JSON.parse(document.evaluate('//script[contains(@type,"application/ld+json") and contains(text(),"VideoObject")] ', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText);
      video && video.url && addHiddenDiv('pd_video', video.url);
    } catch (error) {
      console.log('videos not present');
    }
    // description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
    if (manufacturerImageFlag) {
      description && addHiddenDiv('added-manufacturerDesc', description);
    } else {
      description && addHiddenDiv('added-description', description);
    }
  });
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const manuData = document.querySelector('div[id="syndi_powerpage"]  div[class*="syndigo-shadowed-powerpage"]');
    const getShadowDomHtml = (manuData) => {
      if (manuData && manuData.shadowRoot) {
        let imagesHtml = manuData.shadowRoot.childNodes[0];
        imagesHtml = imagesHtml.querySelectorAll('img') || '';
        if (imagesHtml && imagesHtml.length) {
          imagesHtml.forEach(element => {
            addHiddenDiv('manu_img', element.src);
          });
        }
      }
    };
    getShadowDomHtml(manuData);
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
