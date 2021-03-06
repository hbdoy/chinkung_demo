var db = firebase.database();

var allData = {};
var dataList = document.querySelector("#dataList");
var updateBtn = document.querySelector("#updateBtn");
var exportExcel = document.querySelector("#exportExcel");

updateBtn.addEventListener('click', updateClient);
dataList.addEventListener('click', autoFillInData);
exportExcel.addEventListener('click', tranToLoading);

db.ref('/client').once('value', function (snapshot) {
    allData = snapshot.val();
    console.log(allData);
    var str = "";
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            str += `
            <tr>
                <td>
                    <button class="btn btn-info" data-toggle="modal" data-target="#editModal" data-id="${allData[key].id}">修改</button>
                    <button class="btn btn-danger" data-method="del" data-id="${allData[key].id || ""}">刪除</button>
                </td>
                <td>${allData[key].id || ""}</td>
                <td>${allData[key].name || ""}</td>
                <td>${allData[key].principal || ""}</td>
                <td>${allData[key].phone || ""}</td>
                <td>${allData[key].fax || ""}</td>
                <td>${allData[key].uniformNum || ""}</td>
            </tr>`
        }
    }
    document.querySelector("#dataList").innerHTML = str;
});

function autoFillInData(e) {
    // console.log(e.target.dataset.target);
    if (e.target.dataset.target == "#editModal") {
        document.querySelector("#client-id").value = allData[e.target.dataset.id].id || "";
        document.querySelector("#client-name").value = allData[e.target.dataset.id].name || "";
        document.querySelector("#client-nickName").value = allData[e.target.dataset.id].nickName || "";
        document.querySelector("#client-uniformNum").value = allData[e.target.dataset.id].uniformNum || "";
        document.querySelector("#client-principal").value = allData[e.target.dataset.id].principal || "";
        document.querySelector("#client-principalBirth").value = allData[e.target.dataset.id].principalBirth || "";
        document.querySelector("#client-contactMan").value = allData[e.target.dataset.id].contactMan || "";
        document.querySelector("#client-salesMan").value = allData[e.target.dataset.id].salesMan || "";
        document.querySelector("#client-phone").value = allData[e.target.dataset.id].phone || "";
        document.querySelector("#client-companyPhone").value = allData[e.target.dataset.id].companyPhone || "";
        document.querySelector("#client-fax").value = allData[e.target.dataset.id].fax || "";
        document.querySelector("#client-cellPhone").value = allData[e.target.dataset.id].cellPhone || "";
        document.querySelector("#client-postalCode").value = allData[e.target.dataset.id].postalCode || "";
        document.querySelector("#client-email").value = allData[e.target.dataset.id].email || "";
        document.querySelector("#client-address").value = allData[e.target.dataset.id].address || "";
        document.querySelector("#client-deliveryAddr").value = allData[e.target.dataset.id].deliveryAddr || "";
        document.querySelector("#client-invoiceAddr").value = allData[e.target.dataset.id].invoiceAddr || "";
        document.querySelector("#client-invoiceTitle").value = allData[e.target.dataset.id].invoiceTitle || "";
        document.querySelector("#client-credits").value = allData[e.target.dataset.id].credits || "";
        document.querySelector("#client-checkoutDay").value = allData[e.target.dataset.id].checkoutDay || "";
        document.querySelector("#client-billingDay").value = allData[e.target.dataset.id].billingDay || "";
        document.querySelector("#client-requestDay").value = allData[e.target.dataset.id].requestDay || "";
        document.querySelector("#client-note").value = allData[e.target.dataset.id].note || "";
    } else if (e.target.dataset.method == "del") {
        delItem(e.target.dataset.id);
    }
}

function updateClient(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要修改?")) {
            db.ref("/client/" + document.querySelector("#client-id").value).update({
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
                    type: "客戶資料修改",
                    createTime: DateTimezone(8)
                }).then(function () {
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
    if (!allData.hasOwnProperty(id)) {
        validate = false;
        alert("編號不能修改!");
    }
    if (!isNum) {
        validate = false;
        alert("數字欄位僅允許填入數字");
    }
    return validate;
}

function delItem(id) {
    if (confirm("確定要刪除嗎?")) {
        db.ref("/client/" + id).remove()
            .then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "客戶資料刪除",
                    createTime: DateTimezone(8)
                }).then(function () {
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

function tranToLoading() {
    if (confirm("是否要匯出Excel?")) {
        $("#loading").show();
        setTimeout(exportTableToExcel, 1);
    }
}

function exportTableToExcel() {
    var str = "";
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            str += `
                <tr>
                    <td>${allData[key].id || ""}</td>
                    <td>${allData[key].name || ""}</td>
                    <td>${allData[key].nickName || ""}</td>
                    <td>${allData[key].uniformNum || ""}</td>
                    <td>${allData[key].principal || ""}</td>
                    <td>${allData[key].principalBirth || ""}</td>
                    <td>${allData[key].contactMan || ""}</td>
                    <td>${allData[key].salesMan || ""}</td>
                    <td>${allData[key].phone || ""}</td>
                    <td>${allData[key].companyPhone || ""}</td>
                    <td>${allData[key].fax || ""}</td>
                    <td>${allData[key].cellPhone || ""}</td>
                    <td>${allData[key].postalCode || ""}</td>
                    <td>${allData[key].email || ""}</td>
                    <td>${allData[key].address || ""}</td>
                    <td>${allData[key].deliveryAddr || ""}</td>
                    <td>${allData[key].invoiceAddr || ""}</td>
                    <td>${allData[key].invoiceTitle || ""}</td>
                    <td>${allData[key].credits || ""}</td>
                    <td>${allData[key].checkoutDay || ""}</td>
                    <td>${allData[key].billingDay || ""}</td>
                    <td>${allData[key].requestDay || ""}</td>
                    <td>${allData[key].note || ""}</td>
                </tr>`
        }
    }
    $("#customData").html(str);
    // 匯出
    $("#tableExcel").tableExport({
            type: "excel",
            escape: "false"
        },
        'custom');
    $("#customData").html('');
}