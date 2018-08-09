var db = firebase.database();

var createBtn = document.querySelector("#createBtn");

createBtn.addEventListener('click', createVendor);

function createVendor(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要建立?")) {
            db.ref("/vendor/" + document.querySelector("#vendor-id").value).set({
                id: document.querySelector("#vendor-id").value,
                name: document.querySelector("#vendor-name").value,
                nickName: document.querySelector("#vendor-nickName").value,
                uniformNum: document.querySelector("#vendor-uniformNum").value,
                principal: document.querySelector("#vendor-principal").value,
                contactMan: document.querySelector("#vendor-contactMan").value,
                phone: document.querySelector("#vendor-phone").value,
                companyPhone: document.querySelector("#vendor-companyPhone").value,
                fax: document.querySelector("#vendor-fax").value,
                cellPhone: document.querySelector("#vendor-cellPhone").value,
                postalCode: document.querySelector("#vendor-postalCode").value,
                email: document.querySelector("#vendor-email").value,
                address: document.querySelector("#vendor-address").value,
                invoiceAddr: document.querySelector("#vendor-invoiceAddr").value,
                checkoutDay: document.querySelector("#vendor-checkoutDay").value,
                note: document.querySelector("#vendor-note").value,
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
    var id = document.querySelector("#vendor-id").value;
    var name = document.querySelector("#vendor-name").value;
    var uniformNum = document.querySelector("#vendor-uniformNum").value;
    var postalCode = document.querySelector("#vendor-postalCode").value;
    var checkoutDay = document.querySelector("#vendor-checkoutDay").value;
    var notEmpty = (id != "" && name != "");
    var isNum = !(isNaN(uniformNum) || isNaN(postalCode) || isNaN(checkoutDay));
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