
// const implementation = async (inputs, parameters, context, dependencies) => {
//   console.log('hit zip changer!!');
//   const { zipcode,url } = inputs;

//   const changeZip = async (wantedZip) => {
//     throw new Error('breaking on purpose')
//     await context.click('span#glow-ingress-line2.nav-line-2');
//     await new Promise((resolve, reject) => setTimeout(resolve, 6000));

//     await context.setInputValue('input[aria-label="or enter a US zip code"]', wantedZip);
//     await new Promise((resolve, reject) => setTimeout(resolve, 6000));

//     await context.click('input[aria-labelledby="GLUXZipUpdate-announce"]');
//     await new Promise((resolve, reject) => setTimeout(resolve, 6000));

//     // After clicking apply, check if error msg is present
//     await context.evaluate(() => {
//       const errorMsg = document.querySelector('#GLUXZipError[style="display: inline;"]');
//       if (errorMsg) {
//         throw new Error('Site claiming zip code is invalid');
//       }
//     });

//     await context.click('button[name="glowDoneButton"]');
//   };

//   try {
//     await changeZip(zipcode);
//   } catch (exception) {
//     // try one more time if it fails:
//     // console.log(exception);
//     // await changeZip(zipcode);

//     //try with API if it fails:
//     await context.evaluate(async()=>{
//       const zipcode = '90210';
//       const body = `locationType=LOCATION_INPUT&zipCode=${zipcode}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`
  
//       const response = await fetch('/gp/delivery/ajax/address-change.html', {
//         headers: {
//           accept: 'text/html,*/*',
//           'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
//           'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
//           'x-requested-with': 'XMLHttpRequest',
//         },
//         body,
//         method: 'POST',
//         mode: 'cors',
//         credentials: 'include',
//       });
//       if (response.status !== 200){
//         throw new Error('Zipcode change failed');
//       }
//     });

//     await context.goto(url, { timeout: 15000, waitUntil: 'load', checkBlocked: true });
//   }
// };

// const implementation = async (inputs, parameters, context, dependencies) => {
//   const { zipcode } = inputs;
//   const country = 'US';

//   const changeLocation = () => context.evaluate(async (country, zip) => {

//     const body = zip
//       ? `locationType=LOCATION_INPUT&zipCode=${zip}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`
//       : `locationType=COUNTRY&district=${country}&countryCode=${country}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`;

//     const response = await fetch('/gp/delivery/ajax/address-change.html', {
//       headers: {
//         accept: 'text/html,*/*',
//         'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
//         'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
//         'x-requested-with': 'XMLHttpRequest',
//       },
//       body,
//       method: 'POST',
//       mode: 'cors',
//       credentials: 'include',
//     });
//     return response.status;

//   },country,zipcode);

//   console.log('HIT API ZIP CHANGERRRR');

//   if (await changeLocation() !== 200) {
//     throw new Error(`Cannot change location (${changeLocation})`);
//   }

//   function clearPopup () { context.evaluate(()=>{
//       let popup = document.evaluate("count(//span[@class='a-button-inner']/span[@class='a-button-text' and contains(text(),'Close')])>0", document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
//       let el = document.querySelector('span.a-button-inner span.a-button-text');
//       if (popup && el){
//         el.click()
//       }
//     });
//   } 
//   clearPopup();

// };

const implementation = async (inputs, parameters, context, dependencies) => {
  const { zipcode, url } = inputs;

  await context.evaluate(async (zipcode) => {
    const body = `locationType=LOCATION_INPUT&zipCode=${zipcode}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`

    const response = await fetch('/gp/delivery/ajax/address-change.html', {
      headers: {
        accept: 'text/html,*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
      },
      body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    if (response.status !== 200) {
      throw new Error('Zipcode change failed');
    }
  },zipcode);

  await context.goto(url, {timeout:20000, firstRequestTimeout:20000});
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazonFresh',
    zipcode: '90210',
  },
  implementation,
};
