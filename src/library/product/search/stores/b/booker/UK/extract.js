const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: transform,
    domain: 'booker.co.uk',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

    const urlElem = document.querySelector('div#BackToBrowseAisledDiv a') ? (document.querySelector('div#BackToBrowseAisledDiv a').getAttribute('href').match(/(^.+)&flt/) ? document.querySelector('div#BackToBrowseAisledDiv a').getAttribute('href').match(/(^.+)&flt/)[1] : null) : null
    addElementToDocument('pageURL', '', urlElem)  

    const domain = 'https://www.booker.co.uk'
    const productUrls = document.querySelectorAll('div.info_r1 a')

    productUrls.forEach((e) => {
      const prodUrl = domain.concat(e.getAttribute('href'))
      e.setAttribute('prodUrl', prodUrl)
    });

    const productThumbs = document.querySelectorAll('img.pi')
    
    productThumbs.forEach((e) => {
      // @ts-ignore
      const prodThumbImg = e.currentSrc
      e.setAttribute('prodThumb', prodThumbImg)
    });

    const row = document.querySelectorAll('tr.pr')
    row.forEach((e, index) => {
      const n = (index + 1).toString()
      e.setAttribute('index', n)
    });
  
    });
    
    return await context.extract(productDetails, { transform });
    },
  
    };

