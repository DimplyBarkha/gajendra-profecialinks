const GetTagByIdUsingRegex = (tag,id,html) => {
  return new RegExp("<" + tag + "[^>]*id[\\s]?=[\\s]?['\"]" + id + "['\"][\\s\\S]*?<\/" + tag + ">").exec(html);
};

await fetch(window.location.href, {
  "method": "GET"
}).then(r => r.text()).then(htm => {
const result = GetTagByIdUsingRegex('script', 'is_script', htm);
const outerHTML = result && result[0] ? result[0] : '';

document.body.insertAdjacentHTML('beforeend', outerHTML);

});
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
