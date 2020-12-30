
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim();
        });
      }
      if (row.inTheBoxUrl) {
        let manuImages = row.inTheBoxUrl;
        row.inTheBoxUrl = [];
        manuImages.forEach(ele => {
          let extractfirsturl = ele.text.split(',');
          var obj = {};
          let extracturlbeforeExtn = extractfirsturl[0].split(" ");          
          obj.text = extracturlbeforeExtn[0];     
          if(obj.text.startsWith("//media")){
            row.inTheBoxUrl.push(obj);
          }else{
            obj.text = "//media.flixfacts.com/eyekandy/dyson/v11/it/" + extracturlbeforeExtn[0];
            row.inTheBoxUrl.push(obj);           
          }
          
        });
        
        }
        if(row.inTheBoxText){         
          if(row.inTheBoxText[0].text.startsWith("In dotazione")){
            row.inTheBoxText.forEach(item => {
              item.text = item.text.replace("In dotazione:","");
            });
          }
        }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace(/\./gm, ',');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.match(/([\d]+)/) ? item.text.match(/([\d]+)/)[0] : '';
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          const text = item.text.split(':');
          item.text = text[1] ? text[1] : '';
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          const videoJSON = item.text.includes('playlist') && item.text.includes('file') && JSON.parse(item.text.replace(/\\"/gm, '"')) ? JSON.parse(item.text.replace(/\\"/gm, '"')) : '';
          if (videoJSON) {
            console.log('Inside', videoJSON);
            item.text = (videoJSON.playlist && videoJSON.playlist[0] && videoJSON.playlist[0].file) ? 'https:' + videoJSON.playlist[0].file : '';
          } else if (item.text.includes('youtube')) {
            item.text = 'https:' + item.text;
          } else {
            item.text = '';
          }
        });
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach((item, index) => {
          text += item.text.trim() + ' x ';
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -4),
          },
        ];
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
