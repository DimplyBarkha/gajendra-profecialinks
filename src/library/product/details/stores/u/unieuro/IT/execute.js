module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'IT',
        store: 'unieuro',
        domain: 'unieuro.it',
        zipcode: '',
        loadedSelector: '.container',
        noResultsXPath: '//div[@id="no-results-message"]',
    },
};