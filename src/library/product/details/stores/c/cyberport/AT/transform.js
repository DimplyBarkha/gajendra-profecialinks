
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) { 
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text = text+item.text+"||"
          });
          text= text.toString().substring(0,text.length-2);
          row.description = [{ text }];
        }
        if (row.alternateImages) {
          let text = '';
          row.alternateImages.forEach(item => {
            if(text.indexOf(item.text)<0)
            {
            text = text+item.text+"|";
            }
          });
          text = text.substring(0,text.length-1);
          row.alternateImages = [{ text }];
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            if(text.indexOf(item.text)<0)
            {
            text = text+item.text+"||";
            }
          });
          text = text.substring(0,text.length-1);
          row.additionalDescBulletInfo = [{ text }];
        }        

        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            if(text.indexOf(item.text)<0)
            {
            text = text+item.text+"|";
            }
          });
          text = text.substring(0,text.length-1);
          row.specifications = [{ text }];
        }
        if (row.manufacturerDescription) {
            let text = '';
            row.manufacturerDescription.forEach(item => {
              text = row.manufacturerDescription.map(elm => elm.text).join(' ').replace(/●/g, '||');
            });
            row.manufacturerDescription = [{ text }];
          }

          if (row.price) {
            let text = '';            
              text = row.price[0].text.replace('.',',');
              row.price = [{ text }];
          }

          if (row.mpc) {
            let text = '';            
              text = row.mpc[0].text.replace('Herstellernummer: ','').replace('Manufacturer number: ','').trim();
              row.mpc = [{ text }];
          }
          if (row.ratingCount) {
            let text = '';            
              text = row.ratingCount[0].text.replace('Bewertungen ','').replace('ratings','').trim();
              row.ratingCount = [{ text }];
          }
          if (row.aggregateRating) {
            let text = '';            
              text = row.aggregateRating[0].text.replace(' von 5 Sternen','').replace(' out of 5 stars','').trim();
              row.aggregateRating = [{ text }];
          }
        
      }
    }
  
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
  
  module.exports = { transform };
  