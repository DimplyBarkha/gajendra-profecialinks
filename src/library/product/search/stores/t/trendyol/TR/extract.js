const { transform } = require('../TR/transform');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'TR',
        store: 'trendyol',
        transform,
        zipcode: '',
        domain: 'trendyol.com',
    },
    implementation: async(
        inputs,
        parameters,
        context,
        dependencies,
    ) => {
        await context.evaluate(async() => {
            let apiData;
            await fetch(window.location.href)
                .then((response) => response.json())
                .then((data) => {
                    apiData = data;
                })

            function addDynamicTable(jsonData, appendSelector) {
                function generateDynamicTable(jsonData) {
                    const dataLength = jsonData.length;

                    if (dataLength > 0) {
                        const table = document.createElement("table");
                        table.style.width = "100%";
                        table.setAttribute("border", "1");
                        table.setAttribute("cellspacing", "0");
                        table.setAttribute("cellpadding", "5");

                        const col = [];
                        for (let i = 0; i < dataLength; i++) {
                            for (const key in jsonData[i]) {
                                if (col.indexOf(key) === -1) {
                                    col.push(key);
                                }
                            }
                        }
                        const tHead = document.createElement("thead");
                        tHead.setAttribute("bgcolor", "#CCC4F5");
                        tHead.style.color = "black";
                        const hRow = document.createElement("tr");

                        for (let i = 0; i < col.length; i++) {
                            const th = document.createElement("th");
                            th.innerHTML = col[i];
                            hRow.appendChild(th);
                        }
                        tHead.appendChild(hRow);
                        table.appendChild(tHead);

                        const tBody = document.createElement("tbody");

                        for (let i = 0; i < dataLength; i++) {
                            const bRow = document.createElement("tr");
                            for (let j = 0; j < col.length; j++) {
                                const td = document.createElement("td");
                                table.style.padding = "5px";
                                table.style.margin = "5px auto";
                                td.setAttribute("class", col[j]);
                                if (
                                    jsonData[i][col[j]] &&
                                    (jsonData[i][col[j]] !== "null" ||
                                        jsonData[i][col[j]] !== "undefined")
                                ) {
                                    if (typeof jsonData[i][col[j]] === "object") {
                                        if (Array.isArray(jsonData[i][col[j]])) {
                                            const table = generateDynamicTable(jsonData[i][col[j]]);
                                            table && td.append(table);
                                        } else {
                                            const table = generateDynamicTable([jsonData[i][col[j]]]);
                                            table && td.append(table);
                                        }
                                    } else {
                                        td.innerText = jsonData[i][col[j]];
                                    }
                                }
                                bRow.appendChild(td);
                                bRow.style.padding = "5px";
                            }
                            tBody.appendChild(bRow);
                        }
                        table.appendChild(tBody);
                        return table;
                    }
                }

                const table = generateDynamicTable(jsonData);
                const container = document.createElement("div");
                container.setAttribute("id", "added-table");
                container.setAttribute("style", "overflow:auto");
                container.innerHTML = "";
                container.appendChild(table);
                document.querySelector(appendSelector).append(container);
            }
            if (apiData.result.products.length !== 0) {
                document.body.setAttribute('search-url', window.location.href)
                await addDynamicTable(apiData.result.products, 'body')
            }


        }, );
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};