module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'TR',
        store: 'hepsiburada',
        domain: 'hepsiburada.com',
        loadedSelector: 'body',
        noResultsXPath: '//*[contains(.,"Böyle bir sayfamız")]',
        zipcode: '',
    },
};