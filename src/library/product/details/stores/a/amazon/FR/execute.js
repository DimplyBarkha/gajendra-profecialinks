module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        domain: 'amazon.fr',
        loadedSelector: 'div[id="centerCol"]',
        noResultsXPath: "//a[contains(@href,'dogsofamazon')]",
        zipcode: '75019',
    },
};