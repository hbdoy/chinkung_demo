var db = firebase.database();

var allData = {};
var dataList = document.querySelector("#dataList");
var updateBtn = document.querySelector("#updateBtn");
var exportExcel = document.querySelector("#exportExcel");

updateBtn.addEventListener('click', updateVendor);
dataList.addEventListener('click', autoFillInData);
exportExcel.addEventListener('click', tranToLoading);

db.ref('/vendor').once('value', function (snapshot) {
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
                <td>${allData[key].principal}</td>
                <td>${allData[key].phone}</td>
                <td>${allData[key].fax}</td>
                <td>${allData[key].uniformNum}</td>
            </tr>`
        }
    }
    document.querySelector("#dataList").innerHTML = str;
});

function autoFillInData(e) {
    // console.log(e.target.dataset.target);
    if (e.target.dataset.target == "#editModal") {
        document.querySelector("#vendor-id").value = allData[e.target.dataset.id].id;
        document.querySelector("#vendor-name").value = allData[e.target.dataset.id].name;
        document.querySelector("#vendor-nickName").value = allData[e.target.dataset.id].nickName;
        document.querySelector("#vendor-uniformNum").value = allData[e.target.dataset.id].uniformNum;
        document.querySelector("#vendor-principal").value = allData[e.target.dataset.id].principal;
        document.querySelector("#vendor-contactMan").value = allData[e.target.dataset.id].contactMan;
        document.querySelector("#vendor-phone").value = allData[e.target.dataset.id].phone;
        document.querySelector("#vendor-companyPhone").value = allData[e.target.dataset.id].companyPhone;
        document.querySelector("#vendor-fax").value = allData[e.target.dataset.id].fax;
        document.querySelector("#vendor-cellPhone").value = allData[e.target.dataset.id].cellPhone;
        document.querySelector("#vendor-postalCode").value = allData[e.target.dataset.id].postalCode;
        document.querySelector("#vendor-email").value = allData[e.target.dataset.id].email;
        document.querySelector("#vendor-address").value = allData[e.target.dataset.id].address;
        document.querySelector("#vendor-invoiceAddr").value = allData[e.target.dataset.id].invoiceAddr;
        document.querySelector("#vendor-checkoutDay").value = allData[e.target.dataset.id].checkoutDay;
        document.querySelector("#vendor-note").value = allData[e.target.dataset.id].note;
    } else if (e.target.dataset.method == "del") {
        delItem(e.target.dataset.id);
    }
}

function updateVendor(e) {
    e.preventDefault();
    var validate = validateData();
    if (validate) {
        if (confirm("確定要修改?")) {
            db.ref("/vendor/" + document.querySelector("#vendor-id").value).update({
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
                createTime: DateTimezone(8)
            }).then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "廠商資料修改",
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
        db.ref("/vendor/" + id).remove()
            .then(function () {
                db.ref("/userLog").push({
                    uid: user.uid,
                    email: user.email,
                    type: "廠商資料刪除",
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
                    <td>${allData[key].contactMan || ""}</td>
                    <td>${allData[key].phone || ""}</td>
                    <td>${allData[key].companyPhone || ""}</td>
                    <td>${allData[key].fax || ""}</td>
                    <td>${allData[key].cellPhone || ""}</td>
                    <td>${allData[key].postalCode || ""}</td>
                    <td>${allData[key].email || ""}</td>
                    <td>${allData[key].address || ""}</td>
                    <td>${allData[key].invoiceAddr || ""}</td>
                    <td>${allData[key].checkoutDay || ""}</td>
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
        'vendor');
    $("#customData").html('');
}