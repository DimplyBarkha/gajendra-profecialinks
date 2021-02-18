const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.dk',
    zipcode: '',
  },
  implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function(){
    function addEleToDoc (key, value) {
      const prodEle = document.createElement('div');
      prodEle.className = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      document.body.appendChild(prodEle);
    }

    var youtube = document.querySelector('iframe.videoly-box');
    if(youtube){
      var video_list = youtube.contentDocument.getElementsByClassName('b-video-item-tile');
      for(var i=0; i<video_list.length; i++){
        var video_id = video_list[i].getAttribute('data-videoid');
        addEleToDoc('custom_video_class',video_id);
        }
    }
  })
  return await context.extract(productDetails, { transform });
}