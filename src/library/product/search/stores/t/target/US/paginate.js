
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    openSearchDefinition: {
      indexOffset: 24,
      template: 'https://redsky.target.com/v2/plp/search/?keyword={searchTerms}&channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&offset={offset}&pageId=%2Fs%2F{searchTerms}&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea#[!opt!]{"type":"json"}[/!opt!]',
    },
    loadedSelector: 'td.Item.depth_2>table>tbody>tr',
    noResultsXPath: '//td[@class="Item depth_2"]/table/tbody[not(tr)]',
    domain: 'target.com',
  },
};
