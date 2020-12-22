const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
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

    // Function to fetch brandText from script tag as not available directly on DOM.
    function fetchBrandFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@type="application/ld+json"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const brandRegex = /.*Brand.*?name":"(.*?)".*/gm;
      let brandText = '';
      if (brandRegex.test(scriptTagData)) {
        brandText = scriptTagData ? scriptTagData.replace(brandRegex, '$1') : '';
      }
      brandText = brandText ? brandText.trim() : '';
      addHiddenDiv('added_brandText', brandText);
    }
    fetchBrandFromScript();
    if(document.querySelector('div#flix-location-content')){
      const scrollToElement = document.querySelector('div#flix-location-content');
    console.log('scroll element ' + scrollToElement);
    scrollToElement.scrollIntoView({ behavior: 'smooth' });
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(3000);
    if (document.querySelectorAll('div.flix-std-row')) {
      const flixRows = document.querySelectorAll('div.flix-std-row');
      let enhancedContent = '';
      for (let i = 0; i < flixRows.length; i++) {
        if (flixRows[i].querySelector('div[class*="flix-std-title"]')) { enhancedContent += flixRows[i].querySelector('div[class*="flix-std-title"]').innerText + '||'; }
        if (flixRows[i].querySelector('div[class*="flix-std-desc"]')) { enhancedContent += flixRows[i].querySelector('div[class*="flix-std-desc"]').innerText + '||'; }
      }
      if (document.querySelectorAll('div[class*="flix-std-table"] div[class*="flix-std-desc"]')) {
        const moreInfo = document.querySelectorAll('div[class*="flix-std-table"] div[class*="flix-std-desc"]');
        for (let i = 0; i < moreInfo.length; i++) enhancedContent += moreInfo[i].innerText + '||';
        const specsData = document.querySelectorAll('table[class*="flix-std-specs-table"] td');
        for (let i = 0; i < specsData.length; i++) {
          enhancedContent += specsData[i].querySelector('div[class*="flix-value"]').innerText + '||';
          enhancedContent += specsData[i].querySelector('div[class*="flix-title"]').innerText + '||';
        }
      }
      let aplusImage = '';
      if (document.querySelectorAll('div[class*="flix-std-row"]')) {
        const imageList = document.querySelectorAll('div[class*="flix-std-row"]');
        for (let i = 0; i < imageList.length; i++) {
          if (imageList[i].querySelector('img')) {
            if (imageList[i].querySelector('img').hasAttribute('srcset')) aplusImage += imageList[i].querySelector('img').getAttribute('srcset') + ' || ';
          }
        }
      }
      let vidLink = '';
      if (document.querySelector('iframe[title*="media-video"]')) {
        vidLink = document.querySelector('iframe[title*="media-video"]').getAttribute('src');
      }

      addHiddenDiv('enhancedContent', enhancedContent);
      addHiddenDiv('aplusImage', aplusImage);
      addHiddenDiv('vidLink', vidLink);
      console.log(enhancedContent + ' is enhanced content ');
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    transform,
    domain: 'fnac.pt',
    zipcode: '',
  },
  implementation,
};
