module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    domain: 'fust.ch',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  // implementation: async (
  //   { url },
  //   { domain, country },
  //   context,
  //   dependencies
  // ) => {
  //   const { productDetails } = dependencies;
  //   await context.waitForNavigation({ waitUntil: 'networkidle0' });
  //   let apiUrl = 'https://media.flixcar.com/delivery/js/inpage/';
  //   apiUrl = await context.evaluate(async (apiUrl) => {
  //     let dataDiv = document.getElementsByClassName(
  //       'productDetail n-productDetail-Container'
  //     );
  //     // let metaTag = dataDiv[0].getElementsByTagName('meta');
  //     // let mpn = metaTag[3].content; //mpn
  //     // let gtin = metaTag[4].content; //ean
  //     // let flixDiv = document.getElementById('flix-inpage');
  //     // let scriptTag = flixDiv.getElementsByTagName('script');
  //     // let distributorId = scriptTag[0].src.split('/')[6]; //distributor
  //     // apiUrl += distributorId + '/de/mpn/' + mpn + '/ean/' + gtin;
  //     // console.log('api url generated' + apiUrl);
  //     // let response = await fetch(apiUrl);
  //     // const data = await response.text();
  //     // console.log('data extracted ' + data);
  //     return apiUrl;
  //     //9269/de/mpn/298884-01/ean/5025155046470
  //   }, apiUrl);

  //   return await context.extract(productDetails);
  // },
};
