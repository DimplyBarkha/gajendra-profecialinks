module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    url: 'https://redsky.target.com/v2/plp/search/?channel=web&count=75&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&keyword={searchTerms}&offset=0&pageId=%2Fs%2F{searchTerms}&pricing_store_id=1465&store_ids=1465%2C872%2C896%2C611%2C354&visitorId=01733590DA0F0201BB54AB96532AB8C5&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_1%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'body',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
};
