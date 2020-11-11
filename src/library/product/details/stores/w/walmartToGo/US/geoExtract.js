//const { transform } = require('../transform');
module.exports = {
    implements: 'product/details/geo/geoExtract',
    parameterValues: {
        country: 'US',
        store: 'walmartToGo',
        transform: null,
        domain: 'walmart.com',
        zipcode: '',
        storeId: '',
    },
    implementation: async(inputs,
        parameters,
        context,
        dependencies,
    ) => {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.evaluate(async function() {
            await new Promise(resolve => setTimeout(resolve, 2814));
            const element = document.getElementById('aplus');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                await new Promise(resolve => setTimeout(resolve, 2197));
            }
            let response = await fetch(`https://www.walmart.com/store/electrode/api/get-crumb`);
            let jsonData = await response.json();
            console.log(jsonData);
            console.log('#####################################')
            let datetime = new Date().getTime();
            let csrf_token = jsonData.crumb;
            let cookieset = [{ "name": "t-loc-psid", "value": `${datetime}|1200` }];
            console.log(cookieset)
            let responsePost = await fetch("https://www.walmart.com/store/electrode/api/preferred", {
                "headers": {
                    "x-csrf-token": csrf_token,
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "content-type": "application/json;charset=UTF-8",
                    "cookie": cookieset
                },
                "body": `{\"preferredStoreId\":1200}`,
                "method": "POST"
            });
            let jsonPost = await responsePost.json();
            console.log(jsonPost);
            await context.reload();
        });
        return await context.extract(productDetails, { transform });
    },
};