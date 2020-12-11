// async function implementation ({ url, zipcode, storeId }, parameters, context, dependencies) {
//   await context.setBlockAds(false);
//   await context.setFirstRequestTimeout(60000);
//   await context.goto(url,
//     {
//       block_ads: false,
//       timeout: 60000,
//       waitUntil: 'load',
//       load_all_resources: true,
//       images_enabled: true,
//     });
//   console.log(zipcode);
//   if (zipcode) {
//     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
//   }
// await context.evaluate(() => {
//   fetch('https://www.eapteka.ru/search/?q=%D0%9B%D0%B8%D0%BD%D0%B7%D1%8B', {
//     headers: {
//       accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//       'accept-language': 'en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7',
//       'sec-fetch-dest': 'document',
//       'sec-fetch-mode': 'navigate',
//       'sec-fetch-site': 'none',
//       'sec-fetch-user': '?1',
//       'upgrade-insecure-requests': '1',
//     },
//     referrerPolicy: 'strict-origin-when-cross-origin',
//     body: null,
//     method: 'GET',
//     mode: 'cors',
//     credentials: 'include',
//   });
// });
// }

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'eapteka.ru',
    timeout: 30000,
    country: 'RU',
    store: 'eapteka',
    zipcode: '',
  },
  // implementation,
};
