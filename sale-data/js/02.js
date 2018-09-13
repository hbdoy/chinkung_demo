var db = firebase.database();

var searchReslt = {};
var returnProduct = "nothing";

$("#searchBtn").click(mySearch);
$("#sell-key").keyup(mySearch);
$("#returnBtn").click(checkReturn);
$("#subBtn").click(createReturn);

autoFillInDate();

function mySearch(e) {
    e.preventDefault();
    var str = "";
    if ($("#sell-key").val() == "") {
        $("#searchResult").html("請輸入資料以供查詢!");
    } else {
        if ($("#sell-key").val() != "") {
            $("#sellProduct").html("");
            $("#searchResult").html("搜尋中請稍後...");
            db.ref('/sell/' + $("#sell-key").val()).once('value', function (snapshot) {
                searchReslt = snapshot.val();
                var str = "";
                if (searchReslt != null) {
                    str += `
                        <tr>
                            <td>
                                <button class="btn btn-info chosenBtn" data-id="${searchReslt.id}">選擇</button>
                            </td>
                            <td>${searchReslt.id}</td>
                            <td>${searchReslt.clientName}</td>
                            <td>${searchReslt.totalAmount}</td>
                            <td>${searchReslt.date}</td>
                        </tr>`;
                }
                if (str == "") {
                    $("#searchResult").html("查無結果，請確認輸入內容正確!");
                } else {
                    $("#searchResult").html(str);
                }
            });
        }
    }
}

$(document).on('click', '.chosenBtn', function (e) {
    var str = "";
    e.preventDefault();
    // console.log(e.target.dataset.id);
    if (e.target.dataset.id != "" && searchReslt.id == e.target.dataset.id) {
        document.querySelector("#return-id").value = searchReslt.id;
        document.querySelector("#return-clientId").value = searchReslt.clientId;
        document.querySelector("#return-clientName").value = searchReslt.clientName;
        document.querySelector("#return-checkoutDay").value = searchReslt.checkoutDay;
        document.querySelector("#return-checkoutMonth").value = searchReslt.checkoutMonth;
        for (var key in searchReslt.product) {
            if (searchReslt.product.hasOwnProperty(key)) {
                str += `
                    <tr>
                        <td>${searchReslt.product[key].id}</td>
                        <td>${searchReslt.product[key].name}</td>
                        <td>${searchReslt.product[key].unit}</td>
                        <td>${searchReslt.product[key].num}</td>
                        <td>${searchReslt.product[key].price}</td>
                        <td><input type="number" id="${key}" value="${searchReslt.product[key].num}" max="${searchReslt.product[key].num}"></td>
                    </tr>
                `;
            }
        }
        $("#sellProduct").html(str);
        alert("選擇成功，請繼續完成表單");
    } else {
        alert("發生未知錯誤，請稍後再試");
    }
});

function checkReturn() {
    var str = "確定是否退還以下商品?\n";
    var total = 0;
    returnProduct = {};
    for (var key in searchReslt.product) {
        if (searchReslt.product.hasOwnProperty(key)) {
            if(parseInt(searchReslt.product[key].num) < parseInt($("#" + key).val())){
                returnProduct = "nothing";
                document.querySelector("#return-totalAmount").value = 0;
                alert("退回數量大於售出數量!");
                return;
            }
            str += searchReslt.product[key].name + " * " + $("#" + key).val() + "\n";
            total += $("#" + key).val() * searchReslt.product[key].price;
            returnProduct[key] = {
                id: searchReslt.product[key].id,
                name: searchReslt.product[key].name,
                unit: searchReslt.product[key].unit,
                price: searchReslt.product[key].price,
                returnNum: $("#" + key).val()
            };
        }
    }
    if (!confirm(str)) {
        // 取消則清空退還商品
        returnProduct = "nothing";
    } else {
        document.querySelector("#return-totalAmount").value = total * 1.05;
    }
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
    document.querySelector("#return-date").value = dateFormat(8);
}

function createReturn(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要建立?")) {
            var myId = $("#return-id").val();
            db.ref("/return/" + myId).push({
                id: myId,
                date: document.querySelector("#return-date").value,
                clientId: document.querySelector("#return-clientId").value,
                clientName: document.querySelector("#return-clientName").value,
                checkoutDay: document.querySelector("#return-checkoutDay").value,
                checkoutMonth: document.querySelector("#return-checkoutMonth").value,
                totalAmount: document.querySelector("#return-totalAmount").value,
                note: document.querySelector("#return-note").value,
                product: returnProduct,
                createTime: DateTimezone(8)
            }).then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "銷貨單退回",
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
        }
    }
}

function validateData() {
    var id = document.querySelector("#return-id").value;
    var clientId = document.querySelector("#return-clientId").value;
    var checkoutDay = document.querySelector("#return-checkoutDay").value;
    var totalAmount = document.querySelector("#return-totalAmount").value;
    var returnDate = document.querySelector("#return-date").value;
    var notEmpty = (id != "" && clientId != "" && returnDate != "");
    var isNum = !(isNaN(checkoutDay) || isNaN(totalAmount) || isNaN(id));
    var validate = true;
    if (!notEmpty) {
        validate = false;
        alert("編號,客戶編號不得為空!");
    }
    if (!isNum) {
        validate = false;
        alert("數字欄位僅允許填入數字!");
    }
    if (returnProduct == "nothing") {
        validate = false;
        alert("請確認退回商品!");
    }
    if (totalAmount == 0) {
        validate = false;
        alert("無退回商品!");
    }
    return validate;
}