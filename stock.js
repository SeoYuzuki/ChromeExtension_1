/**
 * 先清除, 後建立元件
 */
function createRows() {

    chrome.storage.local.get({ deals: [] }, function (result) {
        var deals = result.deals;
        $("#tid1").empty();
        $("#tid1").append(getRows(deals));
    });
};
createRows();




/**
 * 新增一條
 */
$("#btn_add").on('click', function (e) {
    let uid = getUid();
    let date = "" + new Date();
    let oneDeal = { uid: uid, date: date, cdate: "", no: "", num: "", shares: "", price: "", tax: "", handlingfee: "", };

    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;

        deals.push(oneDeal);
        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });


});



/**
 * 刪除該筆資料
 */
$("#tid1").on('click', function (e) {
    if (e.target.className == 'btn btn-danger') {
        console.log(e.target.className);

        chrome.storage.local.get({ deals: [] }, function (result) {
            let deals = result.deals;

            let row = e.target.parentElement.parentElement;


            deals = removeDealByUid(deals, row.children[0].id);

            chrome.storage.local.set({ deals: deals }, function () {
                console.log(deals);

                rerender();
            });
        });
    }
});


/**
 * 確認該筆資料OK - 手按OK
 */
$("#tid1").on('click', function (e) {
    if (e.target.className == 'btn btn-primary') {
        thisOK(e);
    }
});

/**
 * 確認該筆資料OK - 鍵盤ok
 */
$("#tid1").on('keyup', function (e) {

    if (e.key === 'Enter' || e.keyCode === 13) {
        console.log("!!!!");
        thisOK(e);
    }
});

/**
 * 確認OK的事件
 */
function thisOK(e) {
    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;

        let row = e.target.parentElement.parentElement;
        let targetuid = row.children[0].id;

        let newDeal = {};

        deals.forEach(function (item, index, arr) {
            if (item.uid === targetuid) {
                console.log(row.children);
                newDeal = item;

                newDeal['cdate'] = row.children[2].children[0].value;
                newDeal['num'] = row.children[3].children[0].value;
                newDeal['shares'] = row.children[4].children[0].value;
                newDeal['price'] = row.children[5].children[0].value;
                newDeal['tax'] = row.children[6].children[0].value;
                newDeal['handlingfee'] = row.children[7].children[0].value;
            }
        });


        deals = removeDealByUid(deals, row.children[0].id);
        deals.push(newDeal);
        chrome.storage.local.set({ deals: deals }, function () {
            console.log(deals);

            rerender();
        });
    });

}

function getRows(deals) {

    let ss = "";
    for (let i = 0; i < deals.length; i++) {
        deal = deals[i];
        ss = ss + useRowTemplate(deal['uid'], deal['no'], deal['cdate'], deal['num'], deal['shares'], deal['price'], deal['tax'], deal['handlingfee'])
    }

    return ss;
}

function useRowTemplate(uid, NO, cdate, num, shares, price, tax, handlingfee) {
    let cost = -1;
    let template = `
    <tr>
        <th name="uid" style="display:none" id="${uid}"></th>
        <th name="NO" scope="row">${NO}</th>        
        <td name="num"><input style="width:100px;" type="text" value="${cdate}"></td>
        <td name="num"><input style="width:50px;" type="text" value="${num}"></td>
        <td name="shares"><input style="width:50px;" type="text" value="${shares}"></td>
        <td name="price"><input style="width:50px;" type="text" value="${price}"></td>
        <td name="tax"><input style="width:50px;" type="text" value="${tax}"></td>
        <td name="handlingfee"><input style="width:50px;" type="text" value="${handlingfee}"></td>
        <td name="cost"><input style="width:50px;" type="text" value="${cost}"></td>
        <td name="num" style="width: 50px;"><button type="button" class="btn btn-danger">del</button></td>
        <td name="num" style="width: 50px;"><button type="button" class="btn btn-primary">ok</button></td>
    </tr>
    `;

    return template;
}

/**
 * 刪除該uid的資料
 */
function removeDealByUid(targetArr, targetuid) {
    //let targetItem = targetItem;
    targetArr.forEach(function (item, index, arr) {
        if (item.uid === targetuid) {
            arr.splice(index, 1);
        }
    });
    return targetArr;
}

function getUid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
}

/**
 * 重新載入畫面? 或是只要部分重繪即可?
 */
function rerender() {
    console.log('re');
    createRows();
    //location.reload();
}