module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        domain: 'ubaldi.com',
        url: 'https://www.ubaldi.com/recherche/{searchTerms}.php',
        loadedSelector: '#main-liste-articles',
        noResultsXPath: 'div.recherche-vide',
        zipcode: '',
    },
};