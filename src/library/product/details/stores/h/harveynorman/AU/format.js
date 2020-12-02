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
                let data=[];
                row.sku.forEach(item => {
                    data = item.text.split("= ");
                    item.text = data[1].replace(";",'');
                    let data1 = JSON.parse(item.text);
                    if(data1['product']['sku']){
                        item.text = data1['product']['sku'];
                    }else{
                        item.text = '';
                    }           
                });
            }
            if (row.brandText) {
                let data=[];
                row.brandText.forEach(item => {
                  data = item.text.split("= ");
                    item.text = data[1].replace(";",'');
                    let data1 = JSON.parse(item.text);
                    if(data1['product']['brand']){
                        item.text = data1['product']['brand'];
                    }else{
                        item.text = '';
                    }          
                });
            }
            if (row.gtin) {
                let data=[];
                row.gtin.forEach(item => {
                    data = item.text.split("= ");
                    item.text = data[1].replace(";",'');
                    let data1 = JSON.parse(item.text);
                    if(data1['product']['barcode_gtin']){
                        item.text = data1['product']['barcode_gtin'];
                    }else{
                        item.text = '';
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
                    }else{
                        item.text = '';
                    }            
                });
            }
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    let data = JSON.parse(item.text);
                    if(data['aggregateRating']){
                        if(data['aggregateRating']['reviewCount']){
                          item.text = data['aggregateRating']['reviewCount'];
                        }
                    }else{
                        item.text = '';
                    }          
                });
            }
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            }
            if (row.directions) {
                let info = [];
                row.directions.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                row.directions = [{'text':info.join(' | '),'xpath':row.directions[0].xpath}];
            }    
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
