var db = firebase.database();

var createBtn = document.querySelector("#createBtn");

createBtn.addEventListener('click', createClient);

function createClient(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要建立?")) {
            db.ref("/client/" + document.querySelector("#client-id").value).set({
                id: document.querySelector("#client-id").value,
                name: document.querySelector("#client-name").value,
                nickName: document.querySelector("#client-nickName").value,
                uniformNum: document.querySelector("#client-uniformNum").value,
                principal: document.querySelector("#client-principal").value,
                principalBirth: document.querySelector("#client-principalBirth").value,
                contactMan: document.querySelector("#client-contactMan").value,
                salesMan: document.querySelector("#client-salesMan").value,
                phone: document.querySelector("#client-phone").value,
                companyPhone: document.querySelector("#client-companyPhone").value,
                fax: document.querySelector("#client-fax").value,
                cellPhone: document.querySelector("#client-cellPhone").value,
                postalCode: document.querySelector("#client-postalCode").value,
                email: document.querySelector("#client-email").value,
                address: document.querySelector("#client-address").value,
                deliveryAddr: document.querySelector("#client-deliveryAddr").value,
                invoiceAddr: document.querySelector("#client-invoiceAddr").value,
                invoiceTitle: document.querySelector("#client-invoiceTitle").value,
                credits: document.querySelector("#client-credits").value,
                checkoutDay: document.querySelector("#client-checkoutDay").value,
                billingDay: document.querySelector("#client-billingDay").value,
                requestDay: document.querySelector("#client-requestDay").value,
                note: document.querySelector("#client-note").value,
                createTime: DateTimezone(8)
            }).then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "客戶資料建檔",
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
    var id = document.querySelector("#client-id").value;
    var name = document.querySelector("#client-name").value;
    var uniformNum = document.querySelector("#client-uniformNum").value;
    var postalCode = document.querySelector("#client-postalCode").value;
    var credits = document.querySelector("#client-credits").value;
    var checkoutDay = document.querySelector("#client-checkoutDay").value;
    var billingDay = document.querySelector("#client-billingDay").value;
    var requestDay = document.querySelector("#client-requestDay").value;
    var notEmpty = (id != "" && name != "");
    var isNum = !(isNaN(uniformNum) || isNaN(postalCode) || isNaN(credits) || isNaN(checkoutDay) || isNaN(billingDay) || isNaN(requestDay));
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