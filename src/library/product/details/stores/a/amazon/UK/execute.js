module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'UK',
        store: 'amazon',
        domain: 'amazon.co.uk',
        loadedSelector: '#main-image-container img , #altImages li[class*="imageThumbnail"] img',
        noResultsXPath: "//a[contains(@href,'dogsofamazon')]",
        zipcode: 'SW1P 3EU',
    },
};