module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'US',
        store: 'drizly',
        domain: 'drizly.com',
        // loadedSelector: 'h1[class^="ProductMetaInformation__ItemName"]',
        noResultsXPath: null,
        zipcode: '',
        storeaddress: '',
        storecity: ''
    },
};