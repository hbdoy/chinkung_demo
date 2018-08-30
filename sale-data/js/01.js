var db = firebase.database();

var allData = {};
var allClient = {};

// 先抓取所有產品，以供查詢
db.ref('/product').once('value', function (snapshot) {
    allData = snapshot.val();
    // console.log(allData);
});

db.ref('/client').once('value', function (snapshot) {
    allClient = snapshot.val();
    // console.log(allClient);
});

autoFillInDate();

$("#createBtn").click(createSell);

// 搜尋產品/客戶
$("#searchBtn").click(mySearch);
$("#client_searchBtn").click(client_mySearch);
$("#item-key").keyup(function (e) {
    mySearch();
});
$("#item-name").keyup(function (e) {
    mySearch();
});
$("#client-id").keyup(function (e) {
    client_mySearch();
});
$("#client-name").keyup(function (e) {
    client_mySearch();
});
$("#client-quick-id").keyup(function (e) {
    quickAddCustomData();
});

function mySearch() {
    var str = "";
    if ($("#item-key").val() == "" && $("#item-name").val() == "") {
        $("#searchResult").html("請輸入資料以供查詢!");
    } else {
        if ($("#item-key").val() != "") {
            for (var key in allData) {
                if (allData.hasOwnProperty(key)) {
                    if (key.indexOf($("#item-key").val()) != -1) {
                        str += `
                        <tr>
                            <td>
                                <button class="btn btn-warning submitProduct" data-id="${allData[key].id}">添加</button>
                            </td>
                            <td>${allData[key].id}</td>
                            <td>${allData[key].name}</td>
                            <td>${allData[key].unit}</td>
                            <td>${allData[key].price}</td>
                            <td>
                                <input type="number" id="m${allData[key].id}" required>
                            </td>
                            <td>
                                <input type="number" id="n${allData[key].id}" required>
                            </td>
                        </tr>
                        `;
                    }
                }
            }
        }
        if ($("#item-name").val() != "") {
            for (var key in allData) {
                if (allData.hasOwnProperty(key)) {
                    if (allData[key].name.indexOf($("#item-name").val()) != -1) {
                        str += `
                        <tr>
                            <td>
                                <button class="btn btn-warning submitProduct" data-id="${allData[key].id}">添加</button>
                            </td>
                            <td>${allData[key].id}</td>
                            <td>${allData[key].name}</td>
                            <td>${allData[key].unit}</td>
                            <td>${allData[key].price}</td>
                            <td>
                                <input type="number" id="m${allData[key].id}" required>
                            </td>
                            <td>
                                <input type="number" id="n${allData[key].id}" required>
                            </td>
                        </tr>
                        `;
                    }
                }
            }
        }
        if (str == "") {
            $("#searchResult").html("查無結果，請確認輸入內容正確!");
        } else {
            $("#searchResult").html(str);
        }
    }
}

function client_mySearch() {
    var str = "";
    if ($("#client-id").val() == "" && $("#client-name").val() == "") {
        $("#client_searchResult").html("請輸入資料以供查詢!");
    } else {
        if ($("#client-id").val() != "") {
            for (var key in allClient) {
                if (allClient.hasOwnProperty(key)) {
                    if (key.indexOf($("#client-id").val()) != -1) {
                        str += `
                        <tr>
                            <td>
                                <button class="btn btn-warning client_submitProduct" data-id="${allClient[key].id}">添加</button>
                            </td>
                            <td>${allClient[key].id}</td>
                            <td>${allClient[key].name}</td>
                        </tr>
                        `;
                    }
                }
            }
        }
        if ($("#client-name").val() != "") {
            for (var key in allClient) {
                if (allClient.hasOwnProperty(key)) {
                    if (allClient[key].name.indexOf($("#client-name").val()) != -1) {
                        str += `
                        <tr>
                            <td>
                                <button class="btn btn-warning client_submitProduct" data-id="${allClient[key].id}">添加</button>
                            </td>
                            <td>${allClient[key].id}</td>
                            <td>${allClient[key].name}</td>
                        </tr>
                        `;
                    }
                }
            }
        }
        if (str == "") {
            $("#client_searchResult").html("查無結果，請確認輸入內容正確!");
        } else {
            $("#client_searchResult").html(str);
        }
    }
}

$(document).on('click', '.submitProduct', function (e) {
    e.preventDefault();
    // console.log(e.target.dataset.id);
    if (!isNaN($("#m" + e.target.dataset.id).val()) && $("#m" + e.target.dataset.id).val() != "" && !isNaN($("#n" + e.target.dataset.id).val()) && $("#n" + e.target.dataset.id).val() != "") {
        $("#sellProduct").append(
            `
            <tr class="${allData[e.target.dataset.id].id}">
                <td>
                    <button class="btn btn-danger removeBtn" data-id="${allData[e.target.dataset.id].id}">刪除</button>
                </td>
                <td class="itemId">${allData[e.target.dataset.id].id}</td>
                <td class="itemName">${allData[e.target.dataset.id].name}</td>
                <td class="itemUnit">${allData[e.target.dataset.id].unit}</td>
                <td class="itemNum">${$("#n" + e.target.dataset.id).val()}</td>
                <td class="itemPrice">${allData[e.target.dataset.id].price}</td>
                <td class="itemFinalPrice">${$("#m" + e.target.dataset.id).val()}</td>
                <td class="itemAmountPrice">${$("#n" + e.target.dataset.id).val() * $("#m" + e.target.dataset.id).val()}</td>
            </tr>
        `
        );
        updateTotalPrice();
        alert("添加成功，請點擊查看銷售商品");
    } else {
        alert("請輸入實際售價和商品數量")
    }
});

$(document).on('click', '.client_submitProduct', function (e) {
    e.preventDefault();
    // console.log(e.target.dataset.id);
    if (e.target.dataset.id != "") {
        document.querySelector("#sale-clientId").value = allClient[e.target.dataset.id].id;
        document.querySelector("#sale-clientName").value = allClient[e.target.dataset.id].name;
        document.querySelector("#sale-deliveryAddr").value = allClient[e.target.dataset.id].deliveryAddr;
        document.querySelector("#sale-checkoutDay").value = allClient[e.target.dataset.id].checkoutDay;
        alert("已經客戶資料填入表單");
    } else {
        alert("發生未知錯誤，請手動輸入");
    }
});

$(document).on('click', '.removeBtn', function (e) {
    if (confirm("確定要刪除嗎?")) {
        $("tr").remove("." + e.target.dataset.id);
        updateTotalPrice();
    }
});

function quickAddCustomData() {
    if ($("#client-quick-id").val() != "") {
        if (allClient.hasOwnProperty($("#client-quick-id").val())) {
            document.querySelector("#sale-clientId").value = allClient[$("#client-quick-id").val()].id;
            document.querySelector("#sale-clientName").value = allClient[$("#client-quick-id").val()].name;
            document.querySelector("#sale-deliveryAddr").value = allClient[$("#client-quick-id").val()].deliveryAddr;
            document.querySelector("#sale-checkoutDay").value = allClient[$("#client-quick-id").val()].checkoutDay;
        }
    }
}

function updateTotalPrice() {
    // 當添加/刪除時，重新計算售出總額
    var totalPrice = 0;
    $(".itemAmountPrice").each(function () {
        // console.log($(this).text());
        totalPrice += parseFloat($(this).text());
    });
    $("#totalPrice").html(totalPrice);
    autoFillInFormPrice(totalPrice);
}

function autoFillInFormPrice(totalPrice) {
    // 將售出商品總額填入表單中的銷貨金額
    document.querySelector("#sale-salesAmount").value = totalPrice;
    document.querySelector("#sale-tax").value = totalPrice * 0.05;
    updateFormPrice();
}

function updateFormPrice() {
    // 折讓金額、含稅金額計算
    // Event keypress 綁在 inline 上
    document.querySelector("#sale-amountAfterDis").value = parseFloat(document.querySelector("#sale-salesAmount").value) - parseFloat(document.querySelector("#sale-salesDiscount").value);
    document.querySelector("#sale-totalAmount").value = parseFloat(document.querySelector("#sale-amountAfterDis").value) + parseFloat(document.querySelector("#sale-tax").value);
}


function createSell(e) {
    // 先儲存銷貨單資料，再儲存售出的商品資訊
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要建立?")) {
            var myId = document.querySelector("#sale-id").value;
            getLastSellId().then(lastId => {
                if(lastId >= myId){
                    myId = parseInt(lastId) + 1;
                }
                db.ref("/sell/" + myId).set({
                    id: myId,
                    date: document.querySelector("#sale-date").value,
                    clientId: document.querySelector("#sale-clientId").value,
                    clientName: document.querySelector("#sale-clientName").value,
                    checkoutDay: document.querySelector("#sale-checkoutDay").value,
                    checkoutMonth: document.querySelector("#sale-checkoutMonth").value,
                    deliveryAddr: document.querySelector("#sale-deliveryAddr").value,
                    invoiceNum: document.querySelector("#sale-invoiceNum").value,
                    salesAmount: document.querySelector("#sale-salesAmount").value,
                    salesDiscount: document.querySelector("#sale-salesDiscount").value,
                    amountAfterDis: document.querySelector("#sale-amountAfterDis").value,
                    taxation: document.querySelector("#sale-taxation").value,
                    tax: document.querySelector("#sale-tax").value,
                    totalAmount: document.querySelector("#sale-totalAmount").value,
                    note: document.querySelector("#sale-note").value,
                    createTime: DateTimezone(8)
                }).then(function () {
                    // console.log("OKOK");
                    var tmpProducts = getSoldProduct();
                    for (var key in tmpProducts) {
                        if (tmpProducts.hasOwnProperty(key)) {
                            // console.log(tmpProducts[key]);
                            db.ref("/sell/" + myId + "/product/" + key).set({
                                id: key,
                                name: tmpProducts[key].name,
                                unit: tmpProducts[key].unit,
                                num: tmpProducts[key].num,
                                price: tmpProducts[key].price,
                            })
                        }
                    }
                }).then(function () {
                    db.ref("/userLog").push({
                        uid: user.uid,
                        email: user.email,
                        type: "銷貨單建立",
                        createTime: DateTimezone(8)
                    }).then(function(){
                        // console.log("OKOK");
                        alert("建立成功");
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }).catch(function () {
                    // console.log("some error");
                    alert("伺服器發生錯誤，請稍後再試");
                });
            });
        }
    }
}

function getLastSellId() {
    return new Promise(function (resolve, reject) {
        db.ref('/sell').orderByKey().limitToLast(1).once('value', function (snapshot) {
                var sell = snapshot.val();
                for (var key in sell) {
                    if (sell.hasOwnProperty(key)) {
                        resolve(sell[key].id);
                    }
                }
            })
            .catch(e => {
                reject("error" + e);
            });
    });
}

function newSellId() {
    return new Promise(function (resolve, reject) {
        getLastSellId().then(id => {
            if (id.toString().substr(0, 8) < dateFormat(8, 2)) {
                // 今日最新單
                resolve(dateFormat(8, 2).toString() + "001");
            } else {
                resolve(parseInt(id) + 1);
            }
        });
    })
}

function getSoldProduct() {
    // 取得表單中的售出商品資訊
    var tmpProducts = {};
    var itemId = document.querySelectorAll(".itemId");
    var itemName = document.querySelectorAll(".itemName");
    var itemUnit = document.querySelectorAll(".itemUnit");
    var itemNum = document.querySelectorAll(".itemNum");
    var itemPrice = document.querySelectorAll(".itemFinalPrice");
    for (var i = 0; i < itemId.length; i++) {
        tmpProducts[itemId[i].textContent] = {
            name: itemName[i].textContent,
            unit: itemUnit[i].textContent,
            num: itemNum[i].textContent,
            price: itemPrice[i].textContent,
        };
    }
    // console.log(tmpProducts);
    return tmpProducts;
}

function validateData() {
    var id = document.querySelector("#sale-id").value;
    var clientId = document.querySelector("#sale-clientId").value;
    var checkoutDay = document.querySelector("#sale-checkoutDay").value;
    var salesAmount = document.querySelector("#sale-salesAmount").value;
    var salesDiscount = document.querySelector("#sale-salesDiscount").value;
    var amountAfterDis = document.querySelector("#sale-amountAfterDis").value;
    var tax = document.querySelector("#sale-tax").value;
    var totalAmount = document.querySelector("#sale-totalAmount").value;
    var notEmpty = (id != "");
    var isNum = !(isNaN(checkoutDay) || isNaN(salesAmount) || isNaN(salesDiscount) || isNaN(amountAfterDis) || isNaN(tax) || isNaN(totalAmount));
    var addedProduct = salesAmount != "";
    var basic = salesDiscount != "" && amountAfterDis != "" && tax != "" && totalAmount != "";
    var addedClient = clientId != "";
    var validate = true;
    if (!notEmpty) {
        validate = false;
        alert("編號不得為空!");
    }
    if(!addedClient){
        validate = false;
        alert("請添加客戶!");
    }
    if (!isNum) {
        validate = false;
        alert("數字欄位僅允許填入數字!");
    }
    if(!addedProduct){
        validate = false;
        alert("請添加售出商品!");
    } else {
        if (!basic) {
            validate = false;
            alert("稅額或銷貨折讓不得為空，沒有則為0");
        }
    }
    return validate;
}

// 新增當地時區的時間物件
function DateTimezone(offset) {
    // 建立現在時間的物件
    d = new Date();
    // 取得 UTC time
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // 新增不同時區的日期資料
    return new Date(utc + (3600000 * offset)).toLocaleString();
    // 8是台北
    // DateTimezone(8)
}

function dateFormat(offset, type = 1) {
    var tmp = DateTimezone(8).split(" ")[0];
    var year = tmp.split("/")[0];
    var month = tmp.split("/")[1];
    var day = tmp.split("/")[2];
    if (month < 10) {
        month = "0" + month.toString();
    }
    if (day < 10) {
        day = "0" + day.toString();
    }
    if (type == 1) return year.toString() + "-" + month.toString() + "-" + day.toString();
    else if (type == 2) return year.toString() + month.toString() + day.toString();
}

function autoFillInDate() {
    // 自動帶入當天日期
    document.querySelector("#sale-date").value = dateFormat(8);
    newSellId().then(id => {
        document.querySelector("#sale-id").value = id;
    });
}