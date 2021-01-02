const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    transform,
    domain: 'placedestendances.com/fr/fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
      await context.evaluate(async function () {
      if(document.getElementById("PopinCloseModal")){
        document.getElementById("PopinCloseModal").click();
      }  
      const getColor = document.querySelector('li.item_description');
      let color = '';
      let dimension = '';
      let getInput;
      if (getColor) {
        const hasDimensionsDetails = document.querySelector('li.item_description').innerText.includes('Dimensions :');
        if (hasDimensionsDetails) {
          const dimensions = document.querySelector('li.item_description').innerText.split('Dimensions : ')[1];
          if (dimensions) { dimension = dimensions.split('\n')[0]; }
          console.log('color done');
        }
        document.body.setAttribute('dimension', dimension);
        const hasColorDetails = document.querySelector('li.item_description').innerText.includes('Couleur');
        if (hasColorDetails) {
          const colors = document.querySelector('li.item_description').innerText.split('Couleur ')[1];
          if (colors) { color = colors.split('\n')[0]; }
          console.log('color done');
        }
        document.body.setAttribute('color', color);
      }
      const getNetWeight = document.querySelector('li.item_description');
      let netweight = '';
      if (getNetWeight) {
        const hasnetweightDetails = document.querySelector('li.item_description').innerText.includes('Poids net');
        if (hasnetweightDetails) {
          const netweights = document.querySelector('li.item_description').innerText.split('Poids net ')[1].split(':')[1];
          if (netweights) { netweight = netweights.split('\n')[0]; }
          console.log(netweight);
        }
        document.body.setAttribute('netweight', netweight);
      }
      const getGrossWeight = document.querySelector('li.item_description');
      let grossweight = '';
      if (getGrossWeight) {
        const hasgrossweightDetails = document.querySelector('li.item_description').innerText.includes('Poids brut');
        if (hasgrossweightDetails) {
          const grossweights = document.querySelector('li.item_description').innerText.split('Poids brut ')[1].split(':')[2];
          if (grossweights) { grossweight = grossweights.split('\n')[0]; }
        }
        document.body.setAttribute('grossweight', grossweight);
      }
      const getWarranty = document.querySelector('li.item_description');
      let warranty = '';
      if (getWarranty) {
        const haswarrantyDetails = document.querySelector('li.item_description').innerText.includes('Garantie');
        if (haswarrantyDetails) {
          const warranties = document.querySelector('li.item_description').innerText.split('Garantie')[1];
          if (warranties) { warranty = warranties.split('-')[0]; }
        }
        document.body.setAttribute('warranty', warranty);
      }
      const getVideo = document.querySelector('div[data-typevideo="youtube"]');
      let video = '';
      if (getVideo) {
        const videoId = document.querySelector('div[data-typevideo="youtube"]').getAttribute('data-video-id');
        if (videoId) { video = 'https://youtu.be/' + videoId; }
      }
      document.body.setAttribute('video', video);
      var div = document.createElement('div');
      var i = 0;
      div.className = 'bulletsdescription';
      const getBulletDescription = document.querySelector('li.item_description');
      if (getBulletDescription) {
        const getCount = document.querySelector('li.item_description').innerText.includes('Informations produit') ? document.querySelector('li.item_description').innerText.split('Informations produit')[1].split('\n\n')[0].split('\n') : null;
        const getDataBullet = document.querySelector('li.item_description').innerText.includes('Accessoires de coiffage') ? document.querySelector('li.item_description').innerText.split('Accessoires de coiffage')[1].split('\n\n')[0].split('\n') : null;
        const getDataBulletDescription = document.querySelector('li.item_description').innerText.includes('Listing des magasins Printemps :') ? document.querySelector('li.item_description').innerText.split('Listing des magasins Printemps :')[1].split('\n\n')[0].split('\n') : null;
        const getDataBulletCharacteristics = document.querySelector('li.item_description').innerText.includes('Caractéristiques :') ? document.querySelector('li.item_description').innerText.split('Caractéristiques :')[1].split('Couleur')[0].split('\n') : null; if (getCount) {
          for (i = 0; i < getCount.length; i++) {
            getInput = document.createElement('li');
            div.appendChild(getInput);
            document.body.appendChild(div);
            if (getCount[i] !== ' ' || getCount[i] !== '') { getInput.setAttribute('value', getCount[i].slice(1)); }
            getInput.setAttribute('valuefeatures', getCount[i].slice(1));
          }
          getInput = document.createElement('li');
          div.appendChild(getInput);
          document.body.appendChild(div);
          console.log(dimension);
          getInput.setAttribute('valuefeatures', `Dimensions : ${dimension}`);
          getInput = document.createElement('li');
          div.appendChild(getInput);
          document.body.appendChild(div);
          console.log(color);
          getInput.setAttribute('valuefeatures', `Couleur ${color}`);
        }
        if (getDataBulletCharacteristics) {
          for (i = 0; i < getDataBulletCharacteristics.length; i++) {
            getInput = document.createElement('li');

            div.appendChild(getInput);
            document.body.appendChild(div);
            if (getDataBulletCharacteristics[i] !== ' ' || getDataBulletCharacteristics[i] !== '') { getInput.setAttribute('value', getDataBulletCharacteristics[i].slice(1)); }
            getInput.setAttribute('valuecharacteristics', getDataBulletCharacteristics[i].slice(1));
          }
          getInput = document.createElement('li');
          div.appendChild(getInput);
          document.body.appendChild(div);
          console.log('dimension');
          getInput.setAttribute('valuecharacteristics', `Dimensions : ${dimension}`); getInput = document.createElement('li');
          div.appendChild(getInput);
          document.body.appendChild(div);
          console.log(color);
          getInput.setAttribute('valuecharacteristics', `Couleur ${color}`);
        }
        if (getDataBullet) {
          for (i = 0; i < getDataBullet.length; i++) {
            getInput = document.createElement('li');

            div.appendChild(getInput);
            document.body.appendChild(div);
            if (getDataBullet[i] !== ' ' || getDataBullet[i] !== '') { getInput.setAttribute('value', getDataBullet[i].slice(1)); }
            getInput.setAttribute('valueaccessories', getDataBullet[i].slice(1));
          }
        }
        if (getDataBulletDescription) {
          for (i = 0; i < getDataBulletDescription.length; i++) {
            getInput = document.createElement('li');

            div.appendChild(getInput);
            document.body.appendChild(div);
            if (getDataBulletDescription[i] !== ' ' || getDataBulletDescription[i] !== '') { getInput.setAttribute('value', getDataBulletDescription[i].slice(1)); }
          }
        }
      }

      let scrollSelector = document.querySelector('#footer_v2 .footer-content');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('#footer_v2 .footer-content');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
      let getSpecificationData = document.querySelectorAll('div.bulletsdescription li');
      let getSpecData = [];
      for (i = 0; i < getSpecificationData.length; i++) {
        if (getSpecificationData[i].getAttribute('valuecharacteristics') !== null && getSpecificationData[i].getAttribute('valuecharacteristics') !== '' && getSpecificationData[i].getAttribute('valuecharacteristics') !== ' ') { getSpecData.push(getSpecificationData[i].getAttribute('valuecharacteristics')); }
      }
      if (getSpecData.length <= 2) {
        getSpecData = [];
        getSpecificationData = document.querySelectorAll('div.bulletsdescription li');
        for (i = 0; i < getSpecificationData.length; i++) {
          if (getSpecificationData[i].getAttribute('valuefeatures') !== null && getSpecificationData[i].getAttribute('valuefeatures') !== '' && getSpecificationData[i].getAttribute('valuefeatures') !== ' ') { getSpecData.push(getSpecificationData[i].getAttribute('valuefeatures')); }
        }
      }
      // @ts-ignore
      [...document.querySelectorAll("div[class*='specification']  td")].forEach(q => {
        getSpecData.push(q.innerText.replace(/\n/g, ''));
      });
      // document.body.setAttribute('specifications', specifications);
      const specdata = getSpecData.join(' || ');
      document.body.setAttribute('specdata', specdata);
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
