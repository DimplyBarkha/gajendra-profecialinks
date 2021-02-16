module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'ES',
        store: 'amazon',
        domain: 'amazon.es',
        zipcode: '28010',
        loadedSelector: '#productTitle',
        // noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,"Sorry! Something went wrong on our end. ")] | //div[@id="g"]//img[contains(@alt,"Dogs")] | //span[contains(text(),"No results for")]',
        noResultsXPath: '//a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,"Sorry! Something went wrong on our end. ")] | //div[@id="g"]//img[contains(@alt,"Dogs")] | //span[contains(text(),"No results for")] | //a[@href="/ref=cs_404_logo"]/@href',
        zipcode: '28010',
    },
};