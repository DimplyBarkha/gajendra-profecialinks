const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'innovasport',
    transform,
    domain: 'innovasport.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const dataLayer = document.evaluate(`//script[@type="application/ld+json"][contains(.,'brand')]`,document).iterateNext();
      if(dataLayer){
        const url = dataLayer.textContent.replace(/(.*)(brand":{"@type":".*","url":")(.*)?("})/,"$3");
        const urlSplit = url.split('/');
        var category =  `${urlSplit[3]} , ${urlSplit[4]} , ${urlSplit[5]} ,  ${urlSplit[6]}` ;     
        document.body.setAttribute('category',category);
      }
    });
  return await context.extract(productDetails);
  }
};
