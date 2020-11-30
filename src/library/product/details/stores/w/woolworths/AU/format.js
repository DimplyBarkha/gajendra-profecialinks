/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
        const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
        data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
        }))));
        return data;
    };    

    for (const { group } of data) {
        for (let row of group) { 

            if (row.sku) {
                row.sku.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['sku']){
                    if(data['sku']){
                      item.text = data['sku'];
                    }
                  }            
                });
            } 

            if (row.variantId) {
                let variId = [];
                row.variantId.forEach(item => {
                    variId =  /[^/]*$/.exec(item.text)[0].split(".");
                    item.text = "" + variId[0];          
                });
            } 

            if (row.description) {
                row.description.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['description']){
                    if(data['description']){
                      item.text = data['description'];
                      item.text = item.text.replace(/<(.|\n)*?>/g, ' | ').trim();
                    }
                  }            
                });
              }  

            if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['aggregateRating']){
                    if(data['aggregateRating']['ratingValue']){
                      item.text = '' + parseFloat(data['aggregateRating']['ratingValue']).toFixed(1);
                    }
                  }            
                });
            } 

            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['aggregateRating']){
                    if(data['aggregateRating']['ratingCount']){
                      item.text = data['aggregateRating']['ratingCount'];
                    }
                  }            
                });
            }  
            if (row.gtin) {
                row.gtin.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['gtin13']){
                    if(data['gtin13']){
                      item.text = data['gtin13'];
                    }
                  }            
                });
            } 
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };