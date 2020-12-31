/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

      // Default transform function
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

    for (const { group } of data) {
      for (const row of group) {  
        try { 
        //   if (row.price || row.listPrice) {
        //     row.price = [{ text: row.price[0].text }, { text: row.onlinePriceCurrency[0].text }];
        //     row.listPrice = [{ text: row.listPrice[0].text }, { text: row.onlinePriceCurrency[0].text }];
        //   }    

      //   if (row.price) {
      //       row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
      //       //  row.listPrice = [{ text: row.listPrice[0].text.substring(1) }, { text: row.listPrice[0].text.charAt(0) }];  
      // }   
      
      if (row.alternateImages) {     
            row.alternateImages= row.alternateImages.slice(1,row.alternateImages.length);       
            let tempdata = row.alternateImages;
            for(let i=0;i<tempdata.length;i++)
            {                
                  row.alternateImages[i] = { text: tempdata[i].text
                                        .replace('canvas=100%2C66','canvas=753%2C502')
                                        .replace('66','502')
                                        .replace('100','753') }                                  
            }            
        }

        if (row.sku) {          
          let tempSku=row.sku[0].text.split(':')
          //tempSku[1] = tempSku[1].substring(16);          
          row.sku = [{ text: tempSku[1].replace(/\\u002D/g,'-').replace(/\\u0022/g,'').replace(',','').trim() }];
        }

         if (row.variantId) {          
          let tempSku=row.variantId[0].text.split(':')
          //tempSku[1] = tempSku[1].substring(16);
          row.variantId = [{ text: tempSku[1].replace(/\\u002D/g,'-').replace(/\\u0022/g,'').replace(',','').trim() }];
        }


        if (row.brandText1) {                    
          row.brandText = [{ text: row.brandText1[0].text.trim() }];
        }

        if (row.weightNet) {                         
          let tempweightNet =  row.weightNet[0].text.replace( /^\D+/g, ''); 
          if (row.weightNet[0].text.indexOf('g') === -1) {
          tempweightNet = tempweightNet.replace('kg','');                   
          row.weightNet = [{ text: tempweightNet.trim() + ' kg' }];
          }
        }

        if (row.warranty1) {                    
          row.warranty = [{ text: row.warranty1[0].text.trim() + ' Year' }];
        }

        // if (row.colour) {         
        //   if (row.colour[0].text.indexOf(':') > -1) {                               
        //     var tempColour = row.colour[0].text.split(':');
        //     // row.colour = [{ text: tempColour[1].replace('\\u003C/p\\u003E\\u003Cp\\u00','').trim() }];
        //     row.colour = [{ text: tempColour[1].replace(/\\u002D/g,'').replace(/\\u0022/g,'').replace(',','').trim() }];
        //   }          
        // }


        if (row.brandText) {          
          let tempbrandText=row.brandText[0].text.split(':')          
          row.brandText = [{ text: tempbrandText[1]?tempbrandText[1].replace(/\\u002D/g,'-').replace(/\\u0022/g,'').replace(',','').trim():'' }];
        }

        
        let newText1 = '';
        if (row.additionalDescBulletInfo) {
              let newText = '';
              let itemp=1;				
              row.additionalDescBulletInfo.forEach(item => {	
              if(itemp===row.additionalDescBulletInfo.length)
              {
                item.text = item.text;
              }								
              else{
                item.text = item.text + ' || ';
              }	
              newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
              itemp = itemp+ 1;
              });				  
            newText1 = newText.trim();        
            row.additionalDescBulletInfo = [{ text: newText.trim() }];
          }

          if (row.description) {
            let newText = '';
            row.description.forEach(item => {
              newText += row.description.map(elm => elm.text).join(' ').replace(/\n/g, '||');
            });
            row.description = [{ text: newText.trim() + ' || ' +  newText1.trim() }];
          }

          if (row.specifications) {
            let newText = '';
            let itemp=1;				
            row.specifications.forEach(item => {	
            if(itemp===row.specifications.length)
            {
              item.text = item.text;
            }								
            else{
              item.text = item.text + ' || ';
            }	
            newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
            itemp = itemp+ 1;
            });				     
          row.specifications = [{ text: newText.trim() }];
        }
          
        } catch (exception) { console.log('Error in transform', exception); }       
                 
      }
    }
    return data;
  };
  
  module.exports = { transform };