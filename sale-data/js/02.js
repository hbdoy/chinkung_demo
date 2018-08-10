function autoFillInData(e) {
    // console.log(e.target.dataset.target);
    if (e.target.dataset.target == "#editModal") {
        document.querySelector("#sale-id").value = allData[e.target.dataset.id].id;
        document.querySelector("#sale-name").value = allData[e.target.dataset.id].name;
        document.querySelector("#sale-type").value = allData[e.target.dataset.id].type;
        document.querySelector("#sale-unit").value = allData[e.target.dataset.id].unit;
        document.querySelector("#sale-price").value = allData[e.target.dataset.id].price;
        document.querySelector("#sale-recPrice").value = allData[e.target.dataset.id].recPrice;
        document.querySelector("#sale-listPrice").value = allData[e.target.dataset.id].listPrice;
        document.querySelector("#sale-wage").value = allData[e.target.dataset.id].wage;
        document.querySelector("#sale-checkStock").value = allData[e.target.dataset.id].checkStock;
        document.querySelector("#sale-buyDate").value = allData[e.target.dataset.id].buyDate;
        document.querySelector("#sale-sellDate").value = allData[e.target.dataset.id].sellDate;
        document.querySelector("#sale-stock").value = allData[e.target.dataset.id].stock;
        document.querySelector("#sale-safeStock").value = allData[e.target.dataset.id].safeStock;
        document.querySelector("#sale-cost").value = allData[e.target.dataset.id].cost;
        document.querySelector("#sale-note").value = allData[e.target.dataset.id].note;
    }
}