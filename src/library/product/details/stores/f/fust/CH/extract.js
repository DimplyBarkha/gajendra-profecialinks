const transform = require('../../../w/walmart/US/transform');
/**
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
    zipcode: '',
  },

  implementation: async (
    { url },
    { country, domain, transform: transformParam },
    parameters,
    context,
    dependencies
  ) => {
    const { productDetails } = dependencies;
    console.log('Transformed data is ' + parameters.transform.data);
    for (const { group } of parameters.transform.data) {
      for (const row of group) {
        console.log(row + ' transform values');
      }
    }
    //   let currentSelector =
    //     'div[class="productDetail n-productDetail-Container"]';
    //   // await context.waitForNavigation({ waitUntil: 'networkidle0' });
    //   let res = await context.evaluate((currentSelector) => {
    //     return Boolean(document.querySelector(currentSelector));
    //   }, currentSelector);
    //   if (res) {
    //     const { productDetails } = dependencies;
    //     //  await context.waitForNavigation({ waitUntil: 'networkidle0' });
    //     let apiUrl = `https://media.flixcar.com/delivery/js/inpage/`;
    //     let productUrl = await context.evaluate(async (apiUrl) => {
    //       let dataDiv = document.getElementsByClassName(
    //         'productDetail n-productDetail-Container'
    //       );
    //       let metaTag = dataDiv[0].getElementsByTagName('meta');
    //       let mpn = metaTag[3].content; //mpn
    //       let gtin = metaTag[4].content; //ean
    //       let flixDiv = document.getElementById('flix-inpage');
    //       let scriptTag = flixDiv.getElementsByTagName('script');
    //       let distributorId = scriptTag[0].src.split('/')[6]; //distributor
    //       apiUrl += distributorId + '/de/mpn/' + mpn + '/ean/' + gtin;
    //       console.log('api url generated ' + apiUrl);
    //       //let response = await fetch(apiUrl);
    //       //const data = await response.text();
    //       //console.log('data extracted ' + data);
    //       return apiUrl;
    //     }, apiUrl);
    //     await context.goto(productUrl, {
    //       timeout: 250000,
    //       waitUntil: 'load',
    //       checkBlocked: true,
    //     });
    //   }
    return await context.extract(productDetails);
  },
};
