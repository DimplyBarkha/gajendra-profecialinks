
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    transform: null,
    domain: 'placedestendances.com/fr/fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
    await new Promise(r => setTimeout(r, 8000));
    let getColor = document.querySelector('li.item_description')
    let color = ''
    if (getColor) {
    let hasColorDetails = document.querySelector('li.item_description').innerText.includes('Couleur')
    if (hasColorDetails) {
    colors = document.querySelector('li.item_description').innerText.split('Couleur ')[1]
    if(colors)
    color = colors.split('\n')[0]
    console.log("color done");
    }
    document.body.setAttribute('color', color)
    }
    let getNetWeight = document.querySelector('li.item_description')
    let netweight = ''
    if (getNetWeight) {
    let hasnetweightDetails = document.querySelector('li.item_description').innerText.includes('Poids net')
    //console.log(hasColorDetails);
    if (hasnetweightDetails) {
    netweights = document.querySelector('li.item_description').innerText.split('Poids net ')[1].split(':')[1]
    if(netweights)
    netweight = netweights.split('\n')[0]
    console.log(netweight);
    }
    document.body.setAttribute('netweight', netweight)
    }
    let getGrossWeight = document.querySelector('li.item_description')
    let grossweight = ''
    if (getGrossWeight) {
    let hasgrossweightDetails = document.querySelector('li.item_description').innerText.includes('Poids brut')
    //console.log(hasColorDetails);
    if (hasgrossweightDetails) {
    grossweights = document.querySelector('li.item_description').innerText.split('Poids brut ')[1].split(':')[2]
    if(grossweights)
    grossweight = grossweights.split('\n')[0]
    console.log(grossweight);
    }
    document.body.setAttribute('grossweight', grossweight)
    }
    let getWarranty = document.querySelector('li.item_description')
    let warranty = ''
    if (getWarranty) {
    let haswarrantyDetails = document.querySelector('li.item_description').innerText.includes('Garantie')
    //console.log(hasColorDetails);
    if (haswarrantyDetails) {
    warranties = document.querySelector('li.item_description').innerText.split('Garantie')[1]
    if(warranties)
    warranty = warranties.split('-')[0]
    console.log(warranty);
    }
    document.body.setAttribute('warranty', warranty)
    }
    let getVideo = document.querySelector('div[data-typevideo="youtube"]')
    let video = '';
    if (getVideo) {
    let videoId = document.querySelector('div[data-typevideo="youtube"]').getAttribute('data-video-id');
    if (videoId)
    video = 'https://youtu.be/' + videoId
    }
    document.body.setAttribute('video', video)
    
    var div = document.createElement('div');
    div.className = 'bulletsdescription';
    let getBulletDescription = document.querySelector('li.item_description')
    if(getBulletDescription){
    let getCount = document.querySelector('li.item_description').innerText.includes('Informations produit') ? document.querySelector('li.item_description').innerText.split('Informations produit')[1].split('\n\n')[0].split('\n') : null
    let getDataBullet = document.querySelector('li.item_description').innerText.includes('Accessoires de coiffage')?document.querySelector('li.item_description').innerText.split('Accessoires de coiffage')[1].split('\n\n')[0].split('\n'):null
    let getDataBulletDescription = document.querySelector('li.item_description').innerText.includes('Listing des magasins Printemps :')?document.querySelector('li.item_description').innerText.split('Listing des magasins Printemps :')[1].split('\n\n')[0].split('\n'):null
    if(getCount){
    for (i = 0; i < getCount.length; i++) {
    var getInput = document.createElement('li');
    div.appendChild(getInput);
    document.body.appendChild(div);
    if (getCount[i] != ' ' || getCount[i] != '')
    getInput.setAttribute("value", getCount[i].slice(1));
    getInput.setAttribute("valuefeatures", getCount[i].slice(1))
    }
    }
    console.log("Check 1")
    if(getDataBullet){
    for (i = 0; i < getDataBullet.length; i++) {
    var getInput = document.createElement('li');
    
    div.appendChild(getInput);
    document.body.appendChild(div);
    if (getDataBullet[i] != ' ' || getDataBullet[i] != '')
    getInput.setAttribute("value", getDataBullet[i].slice(1));
    getInput.setAttribute("valueaccessories", getDataBullet[i].slice(1));
    }
    }
    if(getDataBulletDescription){
    for (i = 0; i < getDataBulletDescription.length; i++) {
    var getInput = document.createElement('li');
    
    div.appendChild(getInput);
    document.body.appendChild(div);
    if (getDataBulletDescription[i] != ' ' || getDataBulletDescription[i] != '')
    
    getInput.setAttribute("value", getDataBulletDescription[i].slice(1));
    }
    }
    }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
