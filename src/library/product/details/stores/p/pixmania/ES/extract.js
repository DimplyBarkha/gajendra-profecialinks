const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    transform: transform,
    domain: 'pixmania.es',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // console.log(`url: ${inputString.URL}`);
      console.log('Waiting for the page to load.....');
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('Wait over.....');
      // api to fetch the description of the details page
      const url = 'https://www.pixmania.es/p/kodak-pixpro-fz41-camara-compacta-negro-7868164?offerId=24511648';
      fetch('https://live.icecat.biz/api/html?lang=es&content=title%2Cgallery%2Cfeaturelogos%2Cessentialinfo%2Cbulletpoints%2Cmarketingtext%2Cmanuals%2Creasonstobuy%2Ctours3d%2Cvideos%2Cfeaturegroups%2Creviews%2Cproductstory&version=2.0.0&UserName=v.poezevara&GTIN=0819900012903&selector=%23IcecatLive', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: `${url}`,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        // @ts-ignore
      }).then(txt => txt.text()).then(data => responseHtml = data).then(() => console.log(responseHtml));
    });
    console.log('Waiting before exiting navigation.....');
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('Wait over.....');
    return await context.extract(productDetails);
  },
};
