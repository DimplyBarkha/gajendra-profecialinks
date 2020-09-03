module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        domain: 'ubaldi.com',
        loadedSelector: ".fa-infos-dispos > div",
        noResultsXPath: null,
        zipcode: '',
    },
};