
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jiomart.com',
    timeout: null,
    jsonToTable: null,
    store: 'jiomart',
    zipcode: '',
    country: 'IN',
  }, implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    console.log(zipcode);
    if (zipcode){
      const locationCookie = await context.evaluate(async(zipcode)=>{
        const pinInfoResponse = await fetch(`https://www.jiomart.com/mst/rest/v1/pin/${zipcode}`);

        if (pinInfoResponse.status == 200) {
          const responseData = await pinInfoResponse.json();
        
          const pincode = responseData.result.pin || zipcode;
          const city = responseData.result.city;
          const stateCode = responseData.result.state_code;
  
          return `cookie: nms_mgo_pincode = ${pincode}; nms_mgo_city = ${city}; nms_mgo_state_code = ${stateCode}`;
        }
      },zipcode);
      await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true, headers: locationCookie });

    } else {

      await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true});

    }


  },
};
