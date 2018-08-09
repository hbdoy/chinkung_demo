var db = firebase.database();

var createBtn = document.querySelector("#createBtn");

createBtn.addEventListener('click', createProduct);

function createProduct(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要建立?")) {
            db.ref("/product/" + document.querySelector("#item-id").value).set({
                id: document.querySelector("#item-id").value,
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
            }).then(function () {
                // console.log("OKOK");
                alert("建立成功");
                setTimeout(function () {
                    location.reload();
                }, 500);
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
    if (!isNum) {
        validate = false;
        alert("數字欄位僅允許填入數字");
    }
    return validate;
}