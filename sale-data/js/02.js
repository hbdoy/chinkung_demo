var db = firebase.database();

var allData = {};

db.ref('/sell').once('value', function (snapshot) {
    allData = snapshot.val();
    console.log(allData);
    var str = "";
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            str += `
            <tr>
                <td>
                    <button class="btn btn-info chosenBtn" data-id="${allData[key].id}">選擇</button>
                </td>
                <td>${allData[key].id}</td>
                <td>${allData[key].clientName}</td>
                <td>${allData[key].totalAmount}</td>
                <td>${allData[key].date}</td>
            </tr>`
        }
    }
    document.querySelector("#dataList").innerHTML = str;
});

$(document).on('click', '.chosenBtn', function (e) {
    var str = "";
    e.preventDefault();
    // console.log(e.target.dataset.id);
    if (e.target.dataset.id != "") {
        document.querySelector("#return-id").value = allData[e.target.dataset.id].id;
        document.querySelector("#return-clientId").value = allData[e.target.dataset.id].clientId;
        document.querySelector("#return-clientName").value = allData[e.target.dataset.id].clientName;
        document.querySelector("#return-checkoutDay").value = allData[e.target.dataset.id].checkoutDay;
        document.querySelector("#return-checkoutMonth").value = allData[e.target.dataset.id].checkoutMonth;
        for (var key in allData[e.target.dataset.id].product) {
            if (allData[e.target.dataset.id].product.hasOwnProperty(key)) {
                const element = allData[e.target.dataset.id].product[key];
                str += `
                    <tr>
                        <td>
                            <button class="btn btn-danger">刪除(還須確認)</button>
                        </td>
                        <td>${allData[e.target.dataset.id].product[key].id}</td>
                        <td>${allData[e.target.dataset.id].product[key].name}</td>
                        <td>${allData[e.target.dataset.id].product[key].unit}</td>
                        <td>${allData[e.target.dataset.id].product[key].num}</td>
                        <td>${allData[e.target.dataset.id].product[key].price}</td>
                        <td class="itemAmountPrice">${allData[e.target.dataset.id].product[key].price * allData[e.target.dataset.id].product[key].num}</td>
                    </tr>
                `;
            }
        }
        $("#sellProduct").html(str);
        updateTotalPrice();
        alert("選擇成功，請繼續完成表單");
    } else {
        alert("發生未知錯誤，請稍後再試");
    }
});

function updateTotalPrice() {
    // 當刪除時，重新計算售出總額
    var totalPrice = 0;
    $(".itemAmountPrice").each(function () {
        // console.log($(this).text());
        totalPrice += parseFloat($(this).text());
    });
    $("#totalPrice").html(totalPrice);
}