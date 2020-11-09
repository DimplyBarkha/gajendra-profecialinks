module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'SE',
        store: 'apotekhjartat',
        domain: 'apotekhjartat.se',
        loadedSelector: '.product img',
        noResultsXPath: '//*[contains(text(),"nga träffar")]',
        zipcode: '',
    },
};