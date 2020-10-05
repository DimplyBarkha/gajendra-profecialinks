module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'UK',
        store: 'footlocker',
        domain: 'footlocker.co.uk',
        url: 'https://www.footlocker.co.uk/en/search?q={searchTerms}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]',
        loadedSelector: 'img[alt*="Logo"]',
        noResultsXPath: '//h2[contains(text(),"no results")]',
        zipcode: '',
    },
};