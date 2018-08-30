var db = firebase.database();

var allData = {};
var dataList = document.querySelector("#dataList");
var updateBtn = document.querySelector("#updateBtn");

updateBtn.addEventListener('click', updateProduct);
dataList.addEventListener('click', autoFillInData);

db.ref('/product').once('value', function (snapshot) {
    allData = snapshot.val();
    console.log(allData);
    var str = "";
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            str += `
            <tr>
                <td>
                    <button class="btn btn-info" data-toggle="modal" data-target="#editModal" data-id="${allData[key].id}">修改</button>
                    <button class="btn btn-danger" data-method="del" data-id="${allData[key].id}">刪除</button>
                </td>
                <td>${allData[key].id}</td>
                <td>${allData[key].name}</td>
                <td>${allData[key].unit}</td>
                <td>${allData[key].price}</td>
                <td>${allData[key].cost}</td>
                <td>...</td>
            </tr>`
        }
    }
    document.querySelector("#dataList").innerHTML = str;
});

function autoFillInData(e) {
    // console.log(e.target.dataset.target);
    if (e.target.dataset.target == "#editModal") {
        document.querySelector("#item-id").value = allData[e.target.dataset.id].id;
        document.querySelector("#item-name").value = allData[e.target.dataset.id].name;
        document.querySelector("#item-type").value = allData[e.target.dataset.id].type;
        document.querySelector("#item-unit").value = allData[e.target.dataset.id].unit;
        document.querySelector("#item-price").value = allData[e.target.dataset.id].price;
        document.querySelector("#item-recPrice").value = allData[e.target.dataset.id].recPrice;
        document.querySelector("#item-listPrice").value = allData[e.target.dataset.id].listPrice;
        document.querySelector("#item-wage").value = allData[e.target.dataset.id].wage;
        document.querySelector("#item-checkStock").value = allData[e.target.dataset.id].checkStock;
        document.querySelector("#item-buyDate").value = allData[e.target.dataset.id].buyDate;
        document.querySelector("#item-sellDate").value = allData[e.target.dataset.id].sellDate;
        document.querySelector("#item-stock").value = allData[e.target.dataset.id].stock;
        document.querySelector("#item-safeStock").value = allData[e.target.dataset.id].safeStock;
        document.querySelector("#item-cost").value = allData[e.target.dataset.id].cost;
        document.querySelector("#item-note").value = allData[e.target.dataset.id].note;
    } else if(e.target.dataset.method == "del"){
        delItem(e.target.dataset.id);
    }
}

function updateProduct(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要修改?")) {
            db.ref("/product/" + document.querySelector("#item-id").value).update({
                name: document.querySelector("#item-name").value,
                type: document.querySelector("#item-type").value,
                unit: document.querySelector("#item-unit").value,
                price: document.querySelector("#item-price").value,
                recPrice: document.querySelector("#item-recPrice").value,
                listPrice: document.querySelector("#item-listPrice").value,
                wage: document.querySelector("#item-wage").value,
                checkStock: document.querySelector("#item-checkStock").value,
                buyDate: document.querySelector("#item-buyDate").value,
                sellDate: document.querySelector("#item-sellDate").value,
                stock: document.querySelector("#item-stock").value,
                safeStock: document.querySelector("#item-safeStock").value,
                cost: document.querySelector("#item-cost").value,
                note: document.querySelector("#item-note").value,
                createTime: DateTimezone(8)
            }).then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "商品資料修改",
                    createTime: DateTimezone(8)
                }).then(function(){
                    // console.log("OKOK");
                    alert("修改成功");
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
    var id = document.querySelector("#item-id").value;
    var name = document.querySelector("#item-name").value;
    var price = document.querySelector("#item-price").value;
    var recPrice = document.querySelector("#item-recPrice").value;
    var listPrice = document.querySelector("#item-listPrice").value;
    var wage = document.querySelector("#item-wage").value;
    var stock = document.querySelector("#item-stock").value;
    var safeStock = document.querySelector("#item-safeStock").value;
    var cost = document.querySelector("#item-cost").value;
    var notEmpty = (id != "" && name != "");
    var isNum = !(isNaN(price) || isNaN(recPrice) || isNaN(listPrice) || isNaN(wage) || isNaN(stock) || isNaN(safeStock) || isNaN(cost));
    var validate = true;
    if (!notEmpty) {
        validate = false;
        alert("編號或名稱不得為空!");
    }
    if(!allData.hasOwnProperty(id)){
        validate = false;
        alert("編號不能修改!");
    }
    if (!isNum) {
        validate = false;
        alert("數字欄位僅允許填入數字!");
    }
    return validate;
}

function delItem(id){
    if(confirm("確定要刪除嗎?")){
        db.ref("/product/" + id).remove()
        .then(function () {
            db.ref("/userLog").push({
                uid: user.uid,
                email: user.email,
                type: "客戶資料刪除",
                createTime: DateTimezone(8)
            }).then(function(){
                // console.log("OKOK");
                alert("刪除成功");
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