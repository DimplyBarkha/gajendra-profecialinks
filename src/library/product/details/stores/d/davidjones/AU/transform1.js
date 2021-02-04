/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      el.text = el.text.trim();
    }))));
    
    for (const { group } of data) {
      for (const row of group) {
        if (row.termsAndConditions) {
          row.termsAndConditions = [
            {
              text: row.termsAndConditions[0].text.toString() == 'true' ? 'Yes' : 'No',
            },
          ];
        }
  
        if (row.videos) {
          let text = '';
          row.videos.forEach(item => {
            text += 'https://www.davidjones.com' + item.text + '|';
          });
          text = text.substring(0, text.length - 1);
          row.videos = [
            {
              text: text,
            },
          ];
        }
  
        if (row.description) {
          const info = [];
          row.description.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
          });
          row.description = [{ text: info.join(' | '), xpath: row.description[0].xpath }];
        }
  
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += item.text + '|';
          });
          text = text.substring(0, text.length - 1);
          row.specifications = [
            {
              text: text,
            },
          ];
        }
  
        if (row.aggregateRating) {
          let aggregatecount = [];
  
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace(/[^0-9,.]+/g, ' ');
            aggregatecount = item.text.split(' ');
          });
          row.aggregateRating = [{ text: aggregatecount[0], xpath: row.aggregateRating[0].xpath }];
        }
  
        if (row.ratingCount) {
          let ratingcount = [];
  
          row.ratingCount.forEach(item => {
            item.text = item.text.replace(/[^0-9,.]+/g, ' ');
            ratingcount = item.text.split(' ');
          });
          const size = ratingcount.length - 2;
  
          row.ratingCount = [{ text: ratingcount[size], xpath: row.ratingCount[0].xpath }];
        }
  
        // if (row.secondaryImageTotal) {
        //   let count = 0;
  
        //   row.secondaryImageTotal.forEach(item => {
        //     count++;
        //   });
  
        //   row.secondaryImageTotal = [{ text: count, xpath: row.secondaryImageTotal[0].xpath }];
        // }
  
        if (row.inTheBoxText) {
          let text = '';
          row.inTheBoxText.forEach(item => {
            if (item.text.toLowerCase().includes('s in the box')) {
              text = item.text.replace(/(.*?)(s in the box|s in the Box)(.*?)(Warranty:)(.*)/g, '$3');
            }
          });
          row.inTheBoxText = [{ text: text.trim() }];
        }
      }
    }
    let data1 = data.map(grp => grp.group[0]);
   // console.log("data#################",data1);
     
    data[0].group = data1;

    data.splice(1)
    //console.log("data#########################",data);
    
    return data;
  };
  
  module.exports = { transform };
  