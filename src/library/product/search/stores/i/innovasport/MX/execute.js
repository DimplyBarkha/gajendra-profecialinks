module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'MX',
        store: 'innovasport',
        domain: 'innovasport.com',
        url: 'https://www.innovasport.com/search/?text={searchTerms}',
        loadedSelector: '.is-pw__products-list',
        noResultsXPath: '//div[@class="note-msg"]//span',
        zipcode: '',
    },
};