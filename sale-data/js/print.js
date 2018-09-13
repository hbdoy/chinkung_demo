var db = firebase.database();

var hash = window.location.hash.replace("#", "");
var orderData = {};
var userData = {};
var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "萬", "億", "萬億", "億億"];
var chnUnitChar = ["", "十", "百", "千"];

if (hash != "") {
    db.ref(`/sell/${hash}`).once('value', function (snapshot) {
            console.log(snapshot.val());
            orderData = snapshot.val();
        })
        .then(function () {
            db.ref(`/client/${orderData.clientId}`).once('value', function (snapshot) {
                console.log(snapshot.val());
                userData = snapshot.val();
                renderForm();
            })
        })
        .catch(function () {
            alert("發生錯誤，請稍後再試!");
        });
}

function renderForm() {
    document.querySelector("#part-one").innerHTML = `
        <tr>
            <td>報價日期</td>
            <td>${orderData.date || ""}</td>
            <td>客戶編號</td>
            <td>${orderData.clientId || ""}</td>
            <td>傳真</td>
            <td>${userData.fax || ""}</td>
        </tr>
        <tr>
            <td>報價單號</td>
            <td>${orderData.id || ""}</td>
            <td>客戶名稱</td>
            <td>${orderData.clientName || ""}</td>
            <td>電話</td>
            <td>${userData.phone || ""}</td>
        </tr>
        <tr>
            <td>送貨地址&收貨人</td>
            <td colspan="3">${orderData.deliveryAddr || ""}</td>
            <td>E-MAIL</td>
            <td>${userData.email || ""}</td>
        </tr>
    `;
    renderForm2();
}

function renderForm2() {
    var str = "";
    var counter = 1;
    for (const key in orderData.product) {
        if (orderData.product.hasOwnProperty(key)) {
            const element = orderData.product[key];
            str += `
                <tr>
                    <td>${counter}</td>
                    <td>${element.id || ""}</td>
                    <td>${element.name || ""}</td>
                    <td>?</td>
                    <td>${element.num || ""}</td>
                    <td>${element.price || ""}</td>
                    <td>${(element.num * element.price) || ""}</td>
                    <td></td>
                </tr>
            `;
            counter++;
        }
    }
    document.querySelector("#part-two").innerHTML = str;
    renderForm3();
}

function renderForm3() {
    document.querySelector("#part-three").innerHTML = `
        <tr>
            <td rowspan="3" class="align-middle" width="60%">
                未稅總金額 新台幣 ： ${NumberToChinese(orderData.salesAmount) || ""}元整
            </td>
            <td width="10%">合計金額</td>
            <td>${orderData.salesAmount || ""}</td>
        </tr>
        <tr>
            <td>營業稅額</td>
            <td>${orderData.tax || ""}</td>
        </tr>
        <tr>
            <td>含稅總計</td>
            <td>${orderData.totalAmount || ""}</td>
        </tr>
    `;
    renderForm4();
}

function renderForm4() {
    document.querySelector("#part-four").innerHTML = `
        <tr>
            <td width="10%">備註</td>
            <td width="90%">${orderData.note || ""}</td>
        </tr>
    `;
    if (confirm("是否開啟列印畫面?")) {
        window.print();
    } else {
        alert("手動開啟列印畫面:\n「CTRL + P」");
    }
}

// 數字轉中文數字
function SectionToChinese(section) {
    var strIns = '',
        chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
        var v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}

function NumberToChinese(num) {
    var unitPos = 0;
    var strIns = '',
        chnStr = '';
    var needZero = false;

    if (num === 0) {
        return chnNumChar[0];
    }

    while (num > 0) {
        var section = num % 10000;
        if (needZero) {
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }

    return chnStr;
}