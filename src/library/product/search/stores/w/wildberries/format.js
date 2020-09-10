/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    for (const { group } of data) {
      for (const row of group) {
        try {
            if (row.thumbnail && row.thumbnail[0]) {
                let arr = row.thumbnail[0].text.split("//")[1].split("/");
                let urlBigSize = "";
                if(arr.join("").indexOf("static.wbstatic.net")>=0){
                   urlBigSize = `https:${row.thumbnail[0].text}`;
                }
                else{
                    arr[1] = "big";
                    urlBigSize = `https://${arr.join("/")}`;
                }
                row.thumbnail[0].text = urlBigSize;
                row.thumbnail.pop();
            }
            if (row.price && row.price[0]) {
              console.log('row.thumbnail[0].text.split("₽")[0]', row.price[0].text.split("₽")[0] )
              row.price[0].text = row.price[0].text !="" ? `${row.price[0].text.split("₽")[0].trim()} ₽` :  "";
            }
        }
        catch(exception){
            console.log(exception);
        }

      }
    }
    return data;
  };
  
  module.exports = { transform };