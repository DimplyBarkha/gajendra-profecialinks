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
                text += `${item.text} | `
            });
            row.alternateImages = [
              {
                text: text.slice(0,-3)
              },
            ];
          }
          if (row.category) {
            let text = '';
            row.category.forEach(item => {
                text += `${item.text} > `
            });
            row.category = [
              {
                text: text.slice(0,-3)
              },
            ];
          }
          if (row.warranty) {
            let text = '';
            row.warranty.forEach(item => {
                text += `${item.text.split('.')[0]}`
            });
            row.warranty = [
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
                        if(eachDesc.toLowerCase().indexOf('weight') > 0 || eachDesc.toLowerCase().indexOf('peso') > 0){
                            text += `${eachDesc} | `
                        }
                    })
                }
            });
            row.weightNet = [
                {
                text: text.trim().slice(0,-2)
                },
            ];
          }
          if (row.eangtin) {
            let text = '';
            row.eangtin.forEach(item => {
                text += `${item.text.slice(item.text.indexOf('EAN')+4, item.text.length).split('.')[0].trim()}`;
            });
            row.eangtin = [
                {
                  text: text 
                },
            ];
          }
          if (row.description) {
            let text = '';
            row.description.forEach(item => {
              text += `${item.text.replace(/\n/g, '||')}  `;
            });
            row.description = [
              {
                text: text.trim()
              },
            ];
          }

          if (row.url) {
            let text = '';
            row.url.forEach(item => {
              text += `${item.text.replace(/\"/g, '').replace(/,/g, '')}  `;
            });
            row.url = [
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
                        if(eachDesc.toLowerCase().indexOf('dimension') > 0){
                            text += `${eachDesc} | `
                        }
                    })
                }
            });
            row.shippingDimensions = [
              {
                text: text.trim().slice(0,-2)
              },
            ];
          }
          if (row.color) {
            let text = '';
            row.color.forEach(item => {
                if(item.text.length > 0 && item.text.split('\n').length > 0){
                    item.text.split('\n').forEach(eachDesc =>{
                        if(eachDesc.toLowerCase().indexOf('color:') > 0){
                            text += `${eachDesc} | `
                        }
                    })
                }
            });
            row.color = [
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
                        if(eachDesc.toLowerCase().indexOf('dimension') > 0){
                            text += `${eachDesc} | `
                        }
                    })
                }
            });
            row.specifications = [
              {
                text: text.trim().slice(0,-2)
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
  