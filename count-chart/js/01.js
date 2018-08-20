var db = firebase.database();

var subBtn = document.querySelector("#subBtn");

subBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if ($("#count-year").val() != "" && !isNaN($("#count-year").val()) && 9 >= parseInt($("#count-year").val() / 1000) && parseInt($("#count-year").val() / 1000) > 0) {
        db.ref("sell").orderByChild('clientId').once('value', function (snapshot) {
            // peopleRef.orderByChild('weight').startAt(2500).endAt(3500).once('value',function(snapshot){
            snapshot.forEach(function (item) {
                console.log(item.key);
                console.log(item.val());
            })
        })
        .then(function(){
            console.log("OK");
        })
        .catch(function(){
            alert("伺服器發生錯誤，請稍後再試");
        });
    } else {
        alert("請填入正確統計年度");
    }
});