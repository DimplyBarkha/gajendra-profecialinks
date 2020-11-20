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
              item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
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
        if (row.variantId) {
          row.variantId.forEach(item => {
            item.text = item.text.replace(/(\s*Artikelnummer\s*:\s*)+/g, '').trim();
            item.text = item.text.replace(/(\s*\n\s*)+/g, '').trim();
          });
        }
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            let j_data = JSON.parse(item.text);
            if (j_data['name'] && j_data['brand']['name']){
              item.text = j_data['name'] + " - " + j_data['brand']['name'];
            }            
          });
        }
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length,'xpath':row.descriptionBullets[0].xpath}];
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {            
              item.text = "https://www.globus.ch" + item.text.replace(/(\s*width=600\s*)+/g, 'width=1000').trim();
          });
        }
        if (row.gtin) {
          row.gtin.forEach(item => {
            var matches = /\s*__NEXT_DATA__\s*=\s*(.*)\;\s*__NEXT_LOADED_PAGES/isg.exec(item.text);              
              if (matches){
                item.text = matches[1];
                try {
                  let j_data = JSON.parse(item.text);
                  let p_ean = '';
                  if (j_data['props']['initialStoreState']['detail']['product']['summary']['sizes']){
                    j_data['props']['initialStoreState']['detail']['product']['summary']['sizes'].forEach(p_size => {
                      if (p_sku == p_size['sku']){
                        p_ean = p_size['eans'][0];                        
                      }
                    });
                    if (p_ean != ''){
                      item.text = p_ean;
                    }
                    else{
                      delete row.gtin;
                    }
                  }
                } catch (error) {
                  console.log(error.message);
                  delete row.gtin;
                }
              }
              else{
                delete row.gtin;
              }
          });
        }
        if (row.variants) {
          let info = [];
          let colors = [];
          row.variants.forEach(item => {            
            var matches = /\s*__NEXT_DATA__\s*=\s*(.*)\;\s*__NEXT_LOADED_PAGES/isg.exec(item.text);              
            if (matches){
              item.text = matches[1];
              try {
                let j_data = JSON.parse(item.text);
                let p_ean = '';
                if (j_data['props']['initialStoreState']['detail']['product']['summary']['variants']){
                  j_data['props']['initialStoreState']['detail']['product']['summary']['variants'].forEach(p_variants => {
                    if(p_variants['id']){
                      info.push(p_variants['id']);
                    }
                    
                    if (p_variants['name']){
                      colors.push(p_variants['name']);
                    }
                  });
                  if (info.length > 0){
                    item.text = info.join(' | ');                      
                  }
                  else{
                    delete row.variants;
                  }
                }
              } catch (error) {
                console.log(error.message);
                delete row.variants;
              }
            }
            else{
              delete row.variants
            }
          });
          if (colors.length>0){
            row.variantInformation = [{"text": colors.join(' | '), "xpath": row.variants[0]["xpath"]}];
          }
          if (info.length>0){
            row.variantCount = [{"text": info.length, "xpath": row.variants[0]["xpath"]}];
            row.firstVariant = [{'text':info[0]}];
          }
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };