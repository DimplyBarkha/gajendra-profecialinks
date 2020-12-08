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
      for (const row of group) {
        let p_sku = '';
        if (row.name) {
          row.name.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['name']){
              item.text = j_data['name'];
            }
            else{
              delete row.name;
            }
          });
        }
        if (row.image) {
          row.image.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['image']){
              item.text = j_data['image'] + "?v=gallery&width=1000";
            }
            else{
              delete row.image;
            }
          });
        }
        if (row.color) {
          row.color.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['color']){
              item.text = j_data['color'];
            }
            else{
              delete row.color;
            }
          });
        }
        if (row.brandText) {
          row.brandText.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['brand']['name']){
              item.text = j_data['brand']['name'];
            }
            else{
              delete row.brandText;
            }
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['description']){
              item.text = j_data['description'];
              item.text = item.text.replace(/(\s*\,\s*)+/g, ' || ').trim();
            }
            else{
              delete row.description;
            }
          });
        }
        if (row.sku) {
          row.sku.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['offers'][0]['sku']){
              item.text = j_data['offers'][0]['sku'];
              p_sku = item.text;
            }
            else{
              delete row.sku;
            }
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['offers'][0]['price'] && j_data['offers'][0]['priceCurrency']){
              item.text = j_data['offers'][0]['priceCurrency'] + " " + j_data['offers'][0]['price'];
            }
            else{
              delete row.price;
            }
          });
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['offers'][0]['availability']){
              item.text = j_data['offers'][0]['availability'];
            }
            else{
              delete row.availabilityText;
            }
          });
        }
        if (row.quantity) {
          let info = [];          
          row.quantity.forEach(item => {
              info.push(item.text.trim());
          });          
          row.quantity = [{'text':info.join(' | '),'xpath':row.quantity[0].xpath}];          
        }
        if (row.variantId) {
          row.variantId.forEach(item => {
            item.text = item.text.replace(/(\s*Artikelnummer\s*:\s*)+/g, '').trim();
            item.text = item.text.replace(/(\s*\n\s*)+/g, '').trim();
          });
        }
        /*if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['name'] && j_data['brand']['name']){
              item.text = j_data['name'] + " - " + j_data['brand']['name'];
            }            
          });
        }*/
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length,'xpath':row.descriptionBullets[0].xpath}];
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {            
              item.text = "https://www.globus.ch" + item.text.replace(/(\s*width=600\s*)+/g, 'width=1000').trim();
          });
        }
        let size_variant = [];
        if (row.gtin) {
          let gtn_id = '';
          row.gtin.forEach(item => {
            var matches = /\s*__NEXT_DATA__\s*=\s*(.*)\;\s*__NEXT_LOADED_PAGES/isg.exec(item.text);              
            item.text = '';
            if (matches){
              let item_text = matches[1];
              try {
                let j_data = JSON.parse(item_text);
                let p_ean = '';
                if (j_data['props'] && j_data['props']['initialStoreState'] && j_data['props']['initialStoreState']['detail'] && j_data['props']['initialStoreState']['detail']['product'] && j_data['props']['initialStoreState']['detail']['product']['summary'] && j_data['props']['initialStoreState']['detail']['product']['summary']['sizes'] && j_data['props']['initialStoreState']['detail']['product']['summary']['sizes'] != null  && j_data['props']['initialStoreState']['detail']['product']['summary']['sizes'].length>0){
                  j_data['props']['initialStoreState']['detail']['product']['summary']['sizes'].forEach(p_size => {
                    if (p_sku == p_size['sku'] && p_size['eans'] && p_size['eans'].length > 0){
                      p_ean = p_size['eans'][0];                        
                    }
                    if (p_size['value'] && p_size['value'] != null && p_size['value'] != 'DEFAULT'){
                      size_variant.push(p_size['value']);
                    }                    
                  });
                  if (p_ean != ''){
                    item.text = p_ean;
                    gtn_id = p_ean;
                  }
                }
              } catch (error) {                  
                console.log("gtn json error");
              }
            }              
          });
          if(gtn_id == '' ){
            delete row.gtin;
          }
        }
        if (row.additionalDescBulletInfo) {
          let info = [];          
          row.additionalDescBulletInfo.forEach(item => {
              info.push(item.text.trim());            
          });          
          row.additionalDescBulletInfo = [{'text':info.join(' | '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
        }
        if (row.variants) {
          let info = [];
          let colors = [];
          row.variants.forEach(item => {            
            var matches = /\s*__NEXT_DATA__\s*=\s*(.*)\;\s*__NEXT_LOADED_PAGES/isg.exec(item.text);              
            item.text = '';
            if (matches){              
              let item_text = matches[1];
              try {
                let j_data = JSON.parse(item_text);
                let p_ean = '';
                if (j_data['props'] && j_data['props']['initialStoreState'] && j_data['props']['initialStoreState']['detail'] && j_data['props']['initialStoreState']['detail']['product'] && j_data['props']['initialStoreState']['detail']['product']['summary'] && j_data['props']['initialStoreState']['detail']['product']['summary']['variants'] && j_data['props']['initialStoreState']['detail']['product']['summary']['variants'] != null && j_data['props']['initialStoreState']['detail']['product']['summary']['variants'].length>0){
                  j_data['props']['initialStoreState']['detail']['product']['summary']['variants'].forEach(p_variants => {
                    if(p_variants['id']){
                      info.push(p_variants['id']);
                    }
                    
                    if (p_variants['color'] != null && p_variants['color']['value']){
                      colors.push(p_variants['color']['value']);
                    }
                    else if(p_variants['name'] != null && p_variants['name'] != 'DEFAULT'){
                      colors.push(p_variants['name']);
                    }
                  });
                                    
                }                
              } catch (error) {
                console.log("json error");
              }
            }            
          });          
          if (colors.length>0 || size_variant.length>0){
            colors.push(...size_variant);
            row.variantInformation = [{"text": colors.join(' | '), "xpath": row.variants[0]["xpath"]}];
            row.variantCount = [{"text": colors.length, "xpath": row.variants[0]["xpath"]}];
          }
          if (info.length>0){
            row.variants = [{"text": info.join(' | '), "xpath": row.variants[0]["xpath"]}];            
            row.firstVariant = [{'text':info[0]}];
          }
          else{
            delete row.variants;
          }
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };