
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jiomart.com',
    timeout: 25000,
    jsonToTable: null,
    store: 'jiomart',
    zipcode: '560012',
    country: 'IN',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const { timeout, zipcode } = parameters;

    
    // #[!opt!]{"headers":{"cookie":"lc-main=en_US"}}[/!opt!]

    // const cookies = 
    // [
    //   { "name": "nms_mgo_pincode", "value": "560012", "path": "/", "domain": ".jiomart.com" },
    //   { "name": "nms_mgo_city", "value": "Bangalore", "path": "/", "domain": ".jiomart.com" },
    //   { "name": "nms_mgo_state_code", "value": "KA", "path": "/", "domain": ".jiomart.com" }
    // ];
    // `#[!opt!]{"headers":{"pin":"560012"},"cookies": [
    //   { "name": "nms_mgo_pincode", "value": "560012", "path": "/", "domain": ".jiomart.com" },
    //   { "name": "nms_mgo_city", "value": "Bangalore", "path": "/", "domain": ".jiomart.com" },
    //   { "name": "nms_mgo_state_code", "value": "KA", "path": "/", "domain": ".jiomart.com" }
    // ][/!opt!]`
   
    // let res = await context.goto(url + '#[!opt!]{"headers":{"cookie":"name=nms_mgo_pincode;value=560012;domain=www.jiomart.com;httpOnly=false;session=false;secure=false;"}}[/!opt!]', 
    // );

    // let allOpts = `#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[{"name":"nms_mgo_pincode","value":"560012","path": "/","domain":"www.jiomart.com","httpOnly":false,"session":false,"secure":false},{"name":"nms_mgo_city","value":"Bangalore","path":"/","domain":"www.jiomart.com","httpOnly":false,"session":false,"secure":false},{"name":"nms_mgo_state_code","value":"KA","path":"/","domain":"www.jiomart.com","httpOnly":false,"session":false,"secure":false}]}[/!opt!]`;
    // let res = await context.goto(url + allOpts);
    // let res = await context.goto(url + `#[!opt!]{"headers":{"cookie":"nms_mgo_pincode=560012; nms_mgo_city=Bangalore; nms_mgo_state_code=KA"}}[/!opt!]`);
    // let res = await context.goto(url + '#[!opt!]{"headers":{"pin":"560012"}}[/!opt!]', options );
    await context.goto(url, { waitUntil:'load'});
    let options = {
      // js_enabled: true,
      // css_enabled: true,
      // block_ads: false,
      // load_all_resources: true,
      // random_move_mouse: true,
      // discard_CSP_header: true,
      headers: {
        // pin: '560012'
        // cookie: 'nms_mgo_pincode=560012; nms_mgo_city=Bangalore; nms_mgo_state_code=KA'
        authority: 'www.jiomart.com',
        path: '/',
        scheme: 'https',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        cookie: 'nms_mgo_pincode=560012; nms_mgo_city=Bangalore; nms_mgo_state_code=KA',
        referer: url,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'same-origin',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': '1',
      },
      // cookies: [
      //   { "name": "nms_mgo_pincode", "value": "560012", "domain": "www.jiomart.com", "path": "/", "httpOnly":false, "secure":false, "session":false },
      //   { "name": "nms_mgo_city", "value": "Bangalore", "domain": "www.jiomart.com", "path": "/", "httpOnly": false, "secure": false, "session": false, },
      //   { "name": "nms_mgo_state_code", "value": "KA", "domain": "www.jiomart.com", "path": "/", "httpOnly": false, "secure": false, "session": false, }
      // ]
    };
   
    let res = await context.goto(url, options );
    
    let currentCookies = await context.cookies();
    await context.evaluate((currentCookies)=>{
      console.table(currentCookies);
      debugger
    },currentCookies)

    if (res.status === 404) {
      throw new Error('blocked!');
    }
  },
};
// headers: { pin: "560012"},
// cookies: [
//     {"name":"nms_mgo_pincode","value":"560012"},
//     {"name":"nms_mgo_city","value":"Bangalore"},
//     {"name":"nms_mgo_state_code","value":"KA"},
//   ]
// cookies: {
  // nms_mgo_pincode: "560012",
  // nms_mgo_city: "Bangalore",
  // nms_mgo_state_code: "KA"
// }

// cookies: [{ name: "currency", value: "USD", path: "/", domain: ".expedia.com" }]

// cookies: [
//   { "name": "nms_mgo_pincode", "value": "560012", "path": "/", "domain": "" },
//   { "name": "nms_mgo_city", "value": "Bangalore", "path": "/", "domain": "" },
//   { "name": "nms_mgo_state_code", "value", "path": "/", "domain": "" }
//     ]

// options = {
//   js_enabled: true,
//   css_enabled: true,
//   block_ads: false,
//   //load_timeout: 60,
//   load_all_resources: true,
//   random_move_mouse: true,
//   discard_CSP_header: true,
//   cookies: [{ name: "currency", value: "USD", path: "/", domain: ".expedia.com" }],
//   proxy: proxyToDebugCaptcha
// };



// module.exports = {
//   implements: 'navigation/goto',
//   parameterValues: {
//     domain: 'jiomart.com',
//     timeout: null,
//     jsonToTable: null,
//     store: 'jiomart',
//     zipcode: '',
//     country: 'IN',
//   }, implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
//     const timeout = parameters.timeout ? parameters.timeout : 30000;

//     console.log(zipcode);
//     if (zipcode) {
//       await context.goto(`https://www.jiomart.com/mst/rest/v1/pin/${zipcode}`, { waitUntil: 'load' });
//       const locationCookie = await context.evaluate(async (zipcode) => {
        // const response = JSON.parse(document.querySelector('body pre').textContent);

        // const pincode = response.result.pin || zipcode;
        // const city = response.result.city;
        // const stateCode = response.result.state_code;

//         return `nms_mgo_pincode = ${pincode}; nms_mgo_city = ${city}; nms_mgo_state_code = ${stateCode}`
//       });

