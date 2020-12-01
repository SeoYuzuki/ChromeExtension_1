function createRows() {

    chrome.storage.local.get({ deals: [] }, function (result) {
        var deals = result.deals;
        console.log(deals);

        $("#tid1").append(getRows(deals));
    });
};
createRows();



$("#tid1").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        console.log(e.target.parentElement.parentElement);
        let row = e.target.parentElement.parentElement;

        let no = row.children[0].innerText;
        let num = row.children[1].children[0].value;//num
        let shares = row.children[2].children[0].value;//shares
        let price = row.children[3].children[0].value;//price

        let oneDeal = { no: no, num: num, shares: shares, price: price };

        chrome.storage.local.get({ deals: [] }, function (result) {
            var deals = result.deals;
            deals.push(oneDeal);
            chrome.storage.local.set({ deals: deals }, function () {
                console.log(deals);
            });
        });
    }
});

$("#btn_add").on('click', function (e) {
    let did ="";
    let oneDeal = { did: did, no: "", num: "", shares: "", price: "" };

});

$("#tid1").on('click', function (e) {
    if (e.target.className == 'btn btn-danger') {
        console.log(e.target.className);
    }
});


function deleteRow() {

}

function getRows(deals) {

    let ss = "";
    for (let i = 0; i < deals.length; i++) {
        deal = deals[i];
        ss = ss + useRowTemplate(deal['no'], deal['num'], deal['shares'], deal['price'])
    }

    return ss;
}

function useRowTemplate(NO, num, shares, price) {

    let template = `
    <tr>
        
        <th name="NO" scope="row">${NO}</th>
        <td name="num" style="width: 50px;"><button type="button" class="btn btn-danger">del</button></td>
        <td name="num"><input style="width:50px;" type="text" value="${num}"></td>
        <td name="shares"><input style="width:50px;" type="text" value="${shares}"></td>
        <td name="price"><input style="width:50px;" type="text" value="${price}"></td>
    </tr>
    `;

    return template;
}