module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'CA',
        store: 'amazon',
        domain: 'amazon.ca',
        zipcode: 'M3H0C3',
        loadedSelector: '#productTitle',
        noResultsXPath: '//a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,"Sorry! Something went wrong on our end. ")] | //div[@id="g"]//img[contains(@alt,"Dogs")] | //span[contains(text(),"No results for")] | //a[@href="/ref=cs_404_logo"]/@href',
    },
};