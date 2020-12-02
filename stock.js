'use strict';

/**
 * 先清除, 後建立元件
 */
function createRows() {

    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;
        console.log(deals);

        $("#lasttotalpf").text("total pf =" + lasttotalpl);


        $("#tid1").empty();
        $("#tid1").append(getRows(deals));

        let dragger1 = tableDragger.default(document.querySelector("#table1"), {
            mode: "row", onlyBody: true
        });
        dragger1.on('drop', function (from, to) {
            console.log('from ' + from + " to " + to);

            maintenanceOrdersByUI2(from - 1, to - 1);
        });
    });
};
createRows();


function maintenanceOrdersByUI2(from, to) {
    if (from == to) {
        return;
    }
    chrome.storage.local.get({ deals: [] }, function (result) {

        let deals = result.deals;
        let temp = Object.assign({}, deals[from]); // 深複製

        if (from > to) {
            deals.splice(to, 0, temp); //插入        
            deals.splice(from + 1, 1); //刪除
            console.log(deals);
        } else if (from < to) {
            deals.splice(to + 1, 0, temp); //插入   
            deals.splice(from, 1); //刪除
        }

        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    })
}

/**
 * 由UI介面順序改變array順序
 */
function maintenanceOrdersByUI() {
    chrome.storage.local.get({ deals: [] }, function (result) {
        let rows = document.getElementById("tid1").children;
        let deals = result.deals;
        for (let i = 0; i < rows.length; i++) {
            deals[getOrderByUid(deals, rows[i].children[1].id)].order = i;
        }



        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });
}

function orderByOrder() {

}

function getOrderByUid(targetArr, targetuid) {
    for (let i = 0; i < targetArr.length; i++) {
        if (targetArr[i].uid == targetuid) {
            return i;
        }
    }
    return -1;
}

/**
 * 新增一條
 */
$("#btn_add").on('click', function (e) {
    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;
        let uid = getUid();
        let date = "" + new Date();
        let oneDeal = {
            uid: uid, order: 999999,
            date: date, buydate: "", cname: "", no: "", num: "", shares: "", buyprice: "", isPawn: false, handlingfee: "",
            selldate: "", sellprice: "", correction: "0"
        };
        Object.preventExtensions(oneDeal);
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

            console.log(row.children[1].id);
            deals = removeDealByUid(deals, row.children[1].id);

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
        let targetuid = row.children[1].id;

        deals.forEach(function (item, index, arr) {
            if (item.uid === targetuid) {
                //console.log(row.children);
                //item = item;
                Object.preventExtensions(item);

                item['cname'] = row.children[2].children[0].value;
                item['num'] = row.children[3].children[0].value;
                item['isPawn'] = row.children[4].children[0].checked;//checked box
                item['handlingfee'] = row.children[5].children[0].value;
                item['shares'] = row.children[6].children[0].value;

                item['buydate'] = row.children[7].children[0].value;

                item['buyprice'] = row.children[8].children[0].value;


                item['selldate'] = row.children[11].children[0].value;
                item['sellprice'] = row.children[12].children[0].value;

                item['correction'] = row.children[15].children[0].value;

            }
        });

        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });

}
let lasttotalpl = 100000000;
function getRows(deals) {
    let totalpl = lasttotalpl;
    let ss = "";

    for (let i = 0; i < deals.length; i++) {
        let deal = deals[i];
        let temp = useRowTemplate(deal, i + 1, totalpl);
        ss = ss + temp.template;
        totalpl = temp.totalpl;
    }

    return ss;
}


function useRowTemplate_0(lastpl) {
    let template = `
    
    <tr class='row1'>
        <th name="NO" scope="row"></th>        
        <th name="uid" style="display:none" id=""></th>        
        <td name="cdate" ></td>
        <td name="cname"></td>
        <td name="num"></td>
        <td name="shares"></td>
        <td name="buyprice"></td>
        <td name="isPawn"></td>
        <td name="handlingfee"></td>
        <td name="buycost"></td>
        <td name="buyallmoney"></td>
        <td name="cdate" style="border-left:5px black solid ;"></td>
        <td name="sellprice"></td>
        <td name="sellcost"></td>
        <td name="sellallmoney"></td>        
        <td name="collection"></td>
        <td style="background-color: ;" name="pl" style="width:100px;"></td>
        <td style="background-color: ;" name="percentage" style="width:100px;"></td>
        <td name="totalpl" style="width:100px;">${lastpl}</td>

    </tr>
    `;
    return template;
}

function useRowTemplate(deal, NO, totalpl) {
    let tax = 0.003;
    let ischecked = "";
    if (deal.isPawn) {
        tax = tax / 2;
        ischecked = "checked"
    }

    let handlingfeezz = 6.5;
    if (deal.handlingfee == "") {
        handlingfeezz = 6.5;
    } else {
        handlingfeezz = deal.handlingfee;
    }
    let fee = handlingfeezz * 0.1 * 0.001425;
    let buycost = Math.ceil(deal.shares * deal.buyprice * (fee));
    let buyallmoney = deal.shares * deal.buyprice + buycost;


    let sellcost = Math.ceil(deal.shares * deal.sellprice * (tax + fee));
    let sellallmoney = deal.shares * deal.sellprice - sellcost;
    let pl = sellallmoney - buyallmoney + parseInt(deal.correction);

    let plcolor = "";
    if (pl > 0) {
        plcolor = "LightPink"
    } else if (pl < 0) {
        plcolor = "DarkSeaGreen";
    }
    let percentage = (100 * (pl / buyallmoney)).toFixed(2) + "%";

    totalpl = totalpl + pl;

    let template = `
    <tr class='row1'>
        <th name="NO" scope="row">${NO}</th>        
        <th name="uid" style="display:none" id="${deal.uid}"></th>                
        <td name="cname"><input style="width:50px;" type="text" value="${deal.cname}"></td>
        <td name="num"><input style="width:50px;" type="text" value="${deal.num}"></td>       
        <td name="isPawn"><input style="width:50px;" type="checkbox" ${ischecked} ></td>
        <td name="handlingfee"><input style="width:50px;" type="text" value="${deal.handlingfee}"></td>
        <td name="shares"><input style="width:50px;" type="text" value="${deal.shares}"></td>
        <td name="cdate" ><input style="width:100px;" type="text" value="${deal.buydate}"></td>
        <td name="buyprice"><input style="width:50px;" type="text" value="${deal.buyprice}"></td>
        <td name="buycost">${buycost}</td>
        <td name="buyallmoney">${buyallmoney}</td>
        <td name="cdate" style="border-left:5px black solid ;"><input style="width:100px;" type="text" value="${deal.selldate}"></td>
        <td name="sellprice"><input style="width:50px;" type="text" value="${deal.sellprice}"></td>
        <td name="sellcost">${sellcost}</td>
        <td name="sellallmoney">${sellallmoney}</td>        
        <td name="collection"><input style="width:100px;" type="text" value="${deal.correction}"></td>
        <td style="background-color: ${plcolor};" name="pl" style="width:100px;">${pl}</td>
        <td style="background-color: ${plcolor};" name="percentage" style="width:100px;">${percentage}</td>
        <td name="totalpl" style="width:100px;">${totalpl}</td>
        <td name="num" style="width: 50px;"><button type="button" class="btn btn-danger">del</button></td>
        <td name="num" style="width: 50px;"><button type="button" class="btn btn-primary">ok</button></td>
    </tr>
    `;

    return { template: template, totalpl: totalpl };
}




/**
 * 刪除該uid的資料
 */
function removeDealByUid(targetArr, targetuid) {
    //let targetItem = targetItem;
    targetArr.forEach(function (item, index, arr) {
        if (item.uid === targetuid || item.uid == undefined) {
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
