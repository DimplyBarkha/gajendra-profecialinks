/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (let row of group) {
        try {
          if (row.alternateImages) {
            let text = '';
            row.alternateImages.forEach(item => {
                text += item.text.indexOf("http") == 0 ? `${item.text} | ` : `https:${item.text} | `;
            });
            row.alternateImages = [
              {
                text: text.slice(0,-3)
              },
            ];
          }
          if (row.url) {
            let text = '';
            row.url.forEach(item => {
                text += item.text.toLowerCase().indexOf("comment") > 0 ? `${item.text.replace('#Comments','')}` : `${item.text}`;
            });
            row.url = [
              {
                text: text
              },
            ];
          }
          if (row.category) {
            let text = '';
            row.category.length > 0 ? 
            row.category.forEach(item => {
                text += `${item.text} > `
            })
            :
            text='';
            let textArr = [];
            textArr.push(`${text.slice(0,-3)}`)
            row.category = [
              {
                text: textArr
              },
            ];
          }
          if (row.name) {
            let text = '';
            row.name.forEach(item => {
                text += `${item.text.split('/')[1]}`
            })
            row.name = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.availabilityText) {
            let text = '';
            row.availabilityText.forEach(item => {
                text += `${item.text.replace('http://schema.org/','')}`
            })
            row.availabilityText = [
              {
                text: text
              },
            ];
          }
          if (row.description) {
            let text = '';
            row.description.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        text += `${eachDesc} || `;
                    })
                }
            })
            row.description = [
              {
                text: text.trim().slice(0,-3)
              },
            ];
          }
          if (row.descriptionBullets) {
            let text = 0;
            row.descriptionBullets.forEach(item => {
                text = item.text.length > 0 ? item.text.split('\n').length : 0;
            })
            row.descriptionBullets = [
              {
                text: text
              },
            ];
          }
          if (row.weightNet) {
            let text = '';
            row.weightNet.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                      if(eachDesc.indexOf('Вес') >=0 && eachDesc.indexOf('без упаковки') >=0)
                         text += `${eachDesc}`
                            
                    })
                }
            })
            row.weightNet = [
              {
                text: `${text.replace(/[^0-9\.]+/g,"")} ${text.split(' ')[text.split(' ').length-1]}`
              },
            ];
          }
          if (row.weightGross) {
            let text = '';
            row.weightGross.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                      if(eachDesc.indexOf('Вес') >=0 && eachDesc.indexOf('с упаковкой') >=0)
                          text += `${eachDesc}`
                            
                    })
                }
            })
            row.weightGross = [
              {
                text: `${text.replace(/[^0-9\.]+/g,"")} ${text.split(' ')[text.split(' ').length-1]}`
              },
            ];
          }
          if (row.directions) {
            let text = '';
            row.directions.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.indexOf('Возрастные ограничения') >=0)
                            text += `${eachDesc}`
                            
                    })
                }
            })
            row.directions = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.shippingDimensions) {
            let text = '';
            row.shippingDimensions.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        let searchresult = eachDesc.toLowerCase();
                        if(searchresult.indexOf('высота') >=0 || searchresult.indexOf('глубина') >=0 || searchresult.indexOf('ширина') >=0)
                            text += `${eachDesc} ; `   
                    })
                }
            })
            row.shippingDimensions = [
              {
                text: text.trim().slice(0,-2)
              },
            ];
          }
          if (row.specifications) {
            let text = '';
            row.specifications.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.toLowerCase().indexOf('страна') == -1)
                            text += `${eachDesc} || `   
                    })
                }
            })
            row.specifications = [
              {
                text: text.trim().slice(0,-3)
              },
            ];
          }
          if (row.warranty) {
            let text = '';
            row.warranty.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.toLowerCase().indexOf('гарантийный срок') >=0)
                            text += `${eachDesc.replace('Гарантийный срок','').replace('\n','')}`
                    })
                }
            })
            row.warranty = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.countryOfOrigin) {
            let text = '';
            row.countryOfOrigin.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.toLowerCase().indexOf('страна бренда') >=0)
                            text += `${eachDesc.replace('Страна бренда','').replace('\n','')}`
                    })
                }
            })
            row.countryOfOrigin = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.manufacturer) {
            let text = '';
            row.manufacturer.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.toLowerCase().indexOf('страна производитель') >=0)
                            text += `${eachDesc.replace('Страна производитель','').replace('\n','')}`
                    })
                }
            })
            row.manufacturer = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.sku) {
            let text = '';
            row.sku.forEach(item => {
                text = item.text.replace("Артикул: ",'');
            })
            row.sku = [
              {
                text: text
              },
            ];
          }
          if (row.promotion) {
            let text = '';
            row.promotion.forEach(item => {
                if(item.text.length > 0){
                    text += `${item.text.replace(/\n/g,'')}`;
                }
            })
            row.promotion = [
              {
                text: text.trim()
              },
            ];
          }
          if (row.variants) {
            let text = '';
            row.variants.forEach(item => {
                if(item.text.length > 0){
                    text += `${item.text} | `;
                }
            })
            row.variants = [
              {
                text: text.slice(0,-3)
              },
            ];
          }
        } catch (exception) {
          console.log(exception);
        }
      }
    }
    return data;
  };
  module.exports = { transform };