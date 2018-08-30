var db = firebase.database();

var allData = {};
var allReturn = {};

$("#searchResult").on('click', '.soldProductBtn' , autoFillInData);

db.ref('/sell').once('value', function (snapshot) {
    allData = snapshot.val();
    var tmp = [];
    var str = "";
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            tmp.push(allData[key]);
        }
    }
    tmp = tmp.reverse();
    for (var i = 0; i < tmp.length; i++) {
        str += `
            <tr>
                <td>
                    <button class="btn btn-danger delBtn" data-id="${tmp[i].id}">刪除</button>
                </td>
                <td>${tmp[i].id}</td>
                <td>${tmp[i].clientId}</td>
                <td>${tmp[i].clientName}</td>
                <td>${tmp[i].totalAmount}</td>
                <td>${tmp[i].date}</td>
                <td>${tmp[i].note}</td>
                <td>
                    <button class="btn btn-info soldProductBtn" data-toggle="modal" data-target="#editModal" data-id="${tmp[i].id}">查看商品</button>
                </td>
            </tr>`;
    }
    $("#searchResult").html(str);
});

db.ref('/return').once('value', function (snapshot) {
    returnProduct = snapshot.val();
});

function autoFillInData(e) {
    var str = "";
    $("#sellProduct").html("載入中...");
    for (var key in allData[e.target.dataset.id].product) {
        if (allData[e.target.dataset.id].product.hasOwnProperty(key)) {
            str += `
                <tr>
                    <td>${allData[e.target.dataset.id].product[key].id}</td>
                    <td>${allData[e.target.dataset.id].product[key].name}</td>
                    <td>${allData[e.target.dataset.id].product[key].unit}</td>
                    <td>${allData[e.target.dataset.id].product[key].num}</td>
                    <td>${allData[e.target.dataset.id].product[key].price}</td>
                    <td>${getReturnNum(e.target.dataset.id, key)}</td>
                </tr>
            `;
        }
    }
    $("#sellProduct").html(str);
}

function getReturnNum (id, outerKey){
    var tmp = 0;
    for (var key in returnProduct[id]) {
        if (returnProduct[id].hasOwnProperty(key)) {
            if(returnProduct[id][key].product.hasOwnProperty(outerKey)){
                tmp += parseInt(returnProduct[id][key].product[outerKey].returnNum);
            }
        }
    }
    return tmp;
}