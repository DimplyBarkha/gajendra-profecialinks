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

    let tmp_desc = '';

    for (const { group } of data) {
        for (let row of group) {          
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                if(tmp_desc != ''){
                info.push(tmp_desc);
                }
                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            } 

            if (row.ratingCount) {
                let rating_count = [];
                row.ratingCount.forEach(item => {
                  rating_count = item.text.split(" ");
                });

                row.ratingCount = [{'text':rating_count[0],'xpath':row.ratingCount[0].xpath}];
            }
            
            if (row.variantId) {
                row.variantId.forEach(item => {
                  item.text = item.text.replace(/(\s*)+/g, '').trim();
                  item.text = item.text.replace('StyleCode:', '').trim();
                });
              }

              if (row.sku) {
                row.sku.forEach(item => {
                  item.text = item.text.replace(/(\s*)+/g, '').trim();
                  item.text = item.text.replace('StyleCode:', '').trim();
                });
              }

            if (row.aggregateRating) {  
                let counter = 0;                 
                row.aggregateRating.forEach(item => {
                    if(item.text.trim() == "TTteaser__icon--full"){
                        counter = counter + 1;
                    }else if(item.text.trim() == "TTteaser__icon--half"){
                        counter = counter + 0.5;
                    }
                });
                row.aggregateRating = [{'text': counter.toFixed(1),'xpath': row.aggregateRating[0].xpath}]        
            }
            if (row.nameExtended) {
                let info = [];
                row.nameExtended.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' - ').trim());
                });
                if(tmp_desc != ''){
                info.push(tmp_desc);
                }
                row.nameExtended = [{'text':info.join(' - '),'xpath':row.nameExtended[0].xpath}];
            }
            if (row.variantInformation) {
                let info = [];
                row.variantInformation.forEach(item => {
                    item.text = item.text.replace(/[_]+/g, " ");
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                if(tmp_desc != ''){
                info.push(tmp_desc);
                }
                row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];
            }
            if (row.additionaldescbulletinfo) {
                let info = [];
                row.additionaldescbulletinfo.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());
                });
                if(tmp_desc != ''){
                info.push(tmp_desc);
                }
                row.additionaldescbulletinfo = [{'text':info.join(' || '),'xpath':row.additionaldescbulletinfo[0].xpath}];
            }
            if (row.gtin) {
                let productId = [];
                let formattedString = ''
                row.gtin.forEach(item => {                    
                    formattedString =  /[^/]*$/.exec(item.text)[0];
                    productId = formattedString.split("?");
                    productId[0] = productId[0].replace("_main", '');
                });
                row.gtin = [{'text': productId[0],'xpath':row.gtin[0].xpath}]; 
            }
            if (row.eangtin) {
                let productId = [];
                let formattedString = ''
                row.eangtin.forEach(item => {                    
                    formattedString =  /[^/]*$/.exec(item.text)[0];
                    productId = formattedString.split("?");
                    productId[0] = productId[0].replace("_main", '');
                });
                row.eangtin = [{'text': productId[0],'xpath':row.eangtin[0].xpath}]; 
            }
            if (row.videoLength) {
                let productId = [];
                let formattedString = ''
                row.videoLength.forEach(item => {                    
                    formattedString =  /[^/]*$/.exec(item.text)[0];
                    productId = formattedString.split("/");
                    productId[0] = (productId[0]).trim();
                });
                row.videoLength = [{'text': productId[0],'xpath':row.videoLength[0].xpath}]; 
            }
            if (row.video) {
                row.video.forEach(item => {
                    item.text = item.text.replace("blob:", '');
                });
            }
            if (row.availabilityText) {          
              row.availabilityText.forEach(item => {
                 if(item.text.trim().includes("Add to Bag")){
                    item.text = "In Stock";
                 }else{
                    item.text = "Out of Stock";
                 }
              });      
            }
            
            if (row.firstVariant) {
                let data=[];
                row.firstVariant.forEach(item => {
                    data = item.text.split("= ");
                    item.text = data[1].replace(";",'').trim();
                    let data1 = JSON.parse(item.text);
                    if(data1['products']){
                        if(data1['products'][0]['skus'][1]){
                            item.text = data1['products'][0]['skus'][0]['sku'];
                        }else{
                            item.text = "";
                        }
                    }else{
                        item.text = "";
                    }           
                });
            }
            if (row.variants) {
                let data=[];
                let info = [];
                row.variants.forEach(item => {
                    data = item.text.split("= ");
                    item.text = data[1].replace(";",'').trim();
                    let data1 = JSON.parse(item.text);
                    if(data1['products'][0]['skus'][1]){
                        data1['products'][0]['skus'].forEach(product => {
                            item.text = product['sku'];
                            info.push(item.text.trim());
                        });
                    }else{
                        item.text = "";
                    }           
                });
                row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];
            }
            if (row.mpc) {
                row.mpc.forEach(item => {
                    let data = item.text.split("\n");
                    let data1 = JSON.parse(data[0]);
                    if(data1['mpn']){
                        item.text = data1['mpn'];
                    }else{
                        item.text = "";
                    }           
                });
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
