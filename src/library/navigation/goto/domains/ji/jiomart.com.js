
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

    const res = await context.goto(url, { 
      first_request_timeout: 60000, 
      timeout, waitUntil: 'load', 
      checkBlocked: true,
      headers: { pin: "560012"},
      cookies: [
          {"name":"nms_mgo_pincode","value":"560012"},
          {"name":"nms_mgo_city","value":"Bangalore"},
          {"name":"nms_mgo_state_code","value":"KA"},
        ]
      // cookies: {
      //   nms_mgo_pincode: "560012",
      //   nms_mgo_city: "Bangalore",
      //   nms_mgo_state_code: "KA"
      // }
    });
    if (res.status === 404) {
      throw new Error('blocked!');
    }
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};


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

//       await context.goto(url + `#[!opt!]{"cookie_jar":[
//           {"name":"nms_mgo_pincode","value":"456001"},
//           {"name":"nms_mgo_city","value":"Ujjain"},
//           {"name":"nms_mgo_state_code","value":"MP"},
//         ]}[/!opt!]`, {
//         first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true,
//       });
//       //   await context.goto(url + `#[!opt!]{"cookie_jar": [{ "name": "cookie", "value": ${locationCookie}}]
//       // } [/!opt!]`, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true,
//       //    headers: { pin: '456001', cookie: locationCookie},
//       // });

//     } else {
//       await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
//     }

//   },
// };
