module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'UK',
        store: 'amazon',
        domain: 'amazon.co.uk',
        loadedSelector: '#main-image-container img , #altImages li[class*="imageThumbnail"] img',
        noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
        zipcode: 'SW1P 3EU',
    },
};