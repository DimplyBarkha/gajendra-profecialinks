module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'thegoodguys.com.au',
        timeout: 50000,
        country: 'AU',
        store: 'thegoodguys',
        zipcode: '',
    },
    implementation: async({ url, zipcode, storeId }, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 10000;
        const searchTerm = url.split('searchTerm=');
        if (searchTerm[1] === 'dyson') {
            url = 'https://www.thegoodguys.com.au/SearchDisplay?categoryId=&storeId=900&catalogId=30000&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&orderBy=0&pageSize=60&searchTerm=%60dyson%60'
        }
        await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
        console.log(zipcode);
        if (zipcode) {
            await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
        }
    },
};