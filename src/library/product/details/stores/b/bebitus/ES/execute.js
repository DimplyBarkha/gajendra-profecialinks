module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'ES',
        store: 'bebitus',
        domain: 'bebitus.com',
        loadedSelector: 'img[class="windeln-zoom-image"]',
        noResultsXPath: "//div[@class='cm-content headline-box']/h1[contains(.,'Lo sentimos')]",
        zipcode: '',
    },
};