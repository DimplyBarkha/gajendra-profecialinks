const { transform } = require('../../../../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    // Method to Retrieve Xpath content of a Single Node
    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    // @ts-ignore
    //var data = getXpath('(//*[contains(text(),"lstEnfants")]/text()', 'nodeValue');
    let abc = $('script:contains("lstEnfants")')[0].innerText
    console.log("abc::::::::" + abc);
    // var images = jsondata.image;
    // images.shift();
    // var imglength = images.length;
    // addElementToDocument('imglength', imglength);
    // var secimg = images.join(' | ');
    // addElementToDocument('AltImg', secimg);
  //}
  });

return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclercdrive',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '982002',
  },
  implementation,
};
