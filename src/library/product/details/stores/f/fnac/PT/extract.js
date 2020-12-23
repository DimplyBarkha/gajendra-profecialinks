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

  const prodUrl = await context.evaluate(async function() {
    return document.URL;
  })
  //get enhancedContent
  try {
    await context.waitForSelector('img[id*=_flixbtn]', {timeout:10000});
  } catch(er) {};

  const enhancedContentUrl = await context.evaluate(async function() {
    let code = document.querySelector('img[id*=_flixbtn]') ? document.querySelector('img[id*=_flixbtn]').getAttribute('id').match(/\d+/g)[0]: "";
    let url  = `https://media.flixcar.com/delivery/inpage/show/418/pt/${code}/json?c=jsonpcar418pt1863608&complimentary=0&type=.html`;
    return url;
  });

  let enhancedContent = null;
  if(enhancedContentUrl) {
    await context.goto(enhancedContentUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    enhancedContent = await context.evaluate(async function() {
      const flixRows = document.querySelectorAll('div.flix-std-row');
      let content = {};
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
      enhancedContent = enhancedContent.replace( /(<([^>]+)>)/ig, '');
      let images = [];
      const imagenodes = document.querySelectorAll('div[class*="flix-std-row"] img');
      imagenodes.forEach(q => {
        if(q.hasAttribute('data-flixsrcset')) {
          images.push(q.getAttribute('data-flixsrcset').replace(/\\\//g, "/").replace(/\\\"/g,""));
        }
      });
      images = images.join(" | ");
      content.enhancedContent = enhancedContent.replace(/(?:\\[rn])+/g, "");
      content.images = images;
      content.videoLinks = [];
      let videoNode = document.querySelector('div[class*=fullJwPlayerWarp] input');
      if(videoNode && videoNode.hasAttribute('value')) {
        let valueAttr = videoNode.getAttribute('value').replace(/\\/g, '');
        valueAttr = JSON.parse(valueAttr);
        if(valueAttr.playlist) {
          valueAttr.playlist.forEach(q => {
            if(q.file) {
              content.videoLinks.push(q.file);
            }
          })
        }
      }
      content.videoLinks = content.videoLinks.join(" | ");
      return content;
    })
  }

  await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });

  await context.evaluate(async function (enhancedContent) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('enhancedContent', enhancedContent.enhancedContent);
    addHiddenDiv('aplusImage', enhancedContent.images);
    addHiddenDiv('vidLink', enhancedContent.videoLinks);
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
    // if (document.querySelectorAll('div.flix-std-row')) {
    //   const flixRows = document.querySelectorAll('div.flix-std-row');
    //   let enhancedContent = '';
    //   for (let i = 0; i < flixRows.length; i++) {
    //     if (flixRows[i].querySelector('div[class*="flix-std-title"]')) { enhancedContent += flixRows[i].querySelector('div[class*="flix-std-title"]').innerText + '||'; }
    //     if (flixRows[i].querySelector('div[class*="flix-std-desc"]')) { enhancedContent += flixRows[i].querySelector('div[class*="flix-std-desc"]').innerText + '||'; }
    //   }
    //   if (document.querySelectorAll('div[class*="flix-std-table"] div[class*="flix-std-desc"]')) {
    //     const moreInfo = document.querySelectorAll('div[class*="flix-std-table"] div[class*="flix-std-desc"]');
    //     for (let i = 0; i < moreInfo.length; i++) enhancedContent += moreInfo[i].innerText + '||';
    //     const specsData = document.querySelectorAll('table[class*="flix-std-specs-table"] td');
    //     for (let i = 0; i < specsData.length; i++) {
    //       enhancedContent += specsData[i].querySelector('div[class*="flix-value"]').innerText + '||';
    //       enhancedContent += specsData[i].querySelector('div[class*="flix-title"]').innerText + '||';
    //     }
    //   }
    //   let aplusImage = '';
    //   if (document.querySelectorAll('div[class*="flix-std-row"]')) {
    //     const imageList = document.querySelectorAll('div[class*="flix-std-row"]');
    //     for (let i = 0; i < imageList.length; i++) {
    //       if (imageList[i].querySelector('img')) {
    //         if (imageList[i].querySelector('img').hasAttribute('srcset')) aplusImage += imageList[i].querySelector('img').getAttribute('srcset') + ' || ';
    //       }
    //     }
    //   }
    //   let vidLink = '';
    //   if (document.querySelector('iframe[title*="media-video"]')) {
    //     vidLink = document.querySelector('iframe[title*="media-video"]').getAttribute('src');
    //   }

    //   addHiddenDiv('enhancedContent', enhancedContent);
    //   addHiddenDiv('aplusImage', aplusImage);
    //   addHiddenDiv('vidLink', vidLink);
    //   console.log(enhancedContent + ' is enhanced content ');
    // }
  }, enhancedContent);
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
