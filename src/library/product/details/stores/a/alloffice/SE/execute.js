module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'SE',
        store: 'alloffice',
        domain: 'alloffice.se',
        loadedSelector: 'main',
        noResultsXPath: '//font[contains(text(),"no hits")] | //font[contains(text(),"try another")]',
        zipcode: '',
    },
};