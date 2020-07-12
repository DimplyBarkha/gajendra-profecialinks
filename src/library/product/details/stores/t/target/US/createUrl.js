module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'target.com',
    prefix: null,
    country: 'US',
    store: 'target',
    // url: 'https://redsky.target.com/v3/pdp/tcin/{id}?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test#[!opt!]{"type":"json"}[/!opt!]',
    url: 'https://www.target.com/s?searchTerm={id}',
  },
};
