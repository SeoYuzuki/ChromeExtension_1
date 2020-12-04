'use strict';

//先前累積
let lasttotalpl = 100000000;

/**
 * 先清除, 後建立元件
 */
function createRows() {

    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;
        console.log("createRows");

        $("#lasttotalpf").text("total pf =" + lasttotalpl);


        $("#tid1").empty();
        $("#tid1").append(getRows(deals));

        let dragger1 = tableDragger.default(document.querySelector("#table1"), {
            mode: "row", onlyBody: true, dragHandler: '.handle',
        });
        dragger1.on('drop', function (from, to) {
            console.log('from ' + from + " to " + to);

            maintenanceOrdersByUI(from - 1, to - 1);
        });
    });
};
createRows();

/**
 * 註冊按鈕事件
 */
$("#tid1").on('click', function (e) {
    //console.log(e.target);
    if (e.target.type = 'button') {
        if (e.target.innerText == 'del') {// 刪除該筆資料
            deleteEvent(e);
        } else if (e.target.innerText == 'lock') {// 鎖定
            lockEvent(e);
        } else if (e.target.innerText == 'clone') {// clone 複製該筆, 插入該位置
            cloneEvent(e);
        } else if (e.target.innerText == 'ok') {// 手按ok
            thisOK(e);
        } else {
            editEvent(e);
        }
    }
});


function maintenanceOrdersByUI(from, to) {
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
            , isLock: false
        };
        Object.preventExtensions(oneDeal);
        deals.push(oneDeal);
        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });
});


/**
 * delete 刪除該筆資料
 */
function deleteEvent(e) {
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

// lock 鎖定
function lockEvent(e) {
    chrome.storage.local.get({ deals: [] }, function (result) {

        let deals = result.deals;

        let row = e.target.parentElement.parentElement;
        let targetuid = row.children[1].id;

        deals.forEach(function (item, index, arr) {
            if (item.uid === targetuid) {
                //console.log(row.children);
                //item = item;
                Object.preventExtensions(item);

                item['isLock'] = !item['isLock'];

            }
        });

        chrome.storage.local.set({ deals: deals }, function () {

            rerender();
        });

    })
}

/**
 * clone 複製該筆, 插入該位置
 * @param {*} e 
 */
function cloneEvent(e) {
    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;

        let row = e.target.parentElement.parentElement;
        let no = row.children[0].innerText;

        let clonedDeal = JSON.parse(JSON.stringify(deals[(no - 1)]));
        clonedDeal.uid = getUid();

        deals.splice((no - 1), 0, clonedDeal); //插入  

        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });
}

/**
 *  按了變成可編輯
 */
function editEvent(e) {
    if (e.target.parentElement.id != "row101") {
        return;
    }

    let axis_array = ["cname", "num", "handlingfee", "shares", "bdate", "buyprice", "sdate", "sellprice", "collection"];
    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;


        let row_id = e.target.parentElement.children[1].id;

        if (getisLockByUID(deals, row_id)) {
            if (axis_array.includes(e.target.axis)) {

                let el_input = document.createElement('input');
                el_input.style = "width:50px; background-color: Cornsilk;"
                el_input.value = e.target.innerText;
                e.target.innerText = "";
                e.target.appendChild(el_input);
                el_input.focus();
                //e.target.empty();
            }
        }

    });
}


/**
 * 確認該筆資料OK - 鍵盤ok
 */
// $("#tid1").on('keyup', function (e) {

//     if (e.key === 'Enter' || e.keyCode === 13) {
//         console.log('ok');
//         $("#dddd").focus();
//         console.log(e.target);
//         //thisOK(e);
//     }
// });

/**
 * 有變動就儲存
 */
$("#tid1").change(function (e) {
    console.log("change");
    thisOK(e);
});

$("#tid1").focusout(function (e) {
    console.log("focusout: ");
    console.log(e);
    thisOK(e);
});




/**
 * 確認OK的事件
 */
function thisOK(e) {
    function func1(item, row, tag, index) {
        if (row.children[index].children.length > 0) {
            item[tag] = row.children[index].children[0].value;
        }
    }

    /**限定是數字, 如果不是則變成0 */
    function func2(item, row, tag, index) {
        if (row.children[index].children.length > 0) {
            let tempValue = row.children[index].children[0].value;
            if (isNaN(tempValue)) {
                item[tag] = "0";
            } else {
                item[tag] = row.children[index].children[0].value;
            }

        }
    }

    chrome.storage.local.get({ deals: [] }, function (result) {
        let deals = result.deals;

        let row = e.target.parentElement.parentElement;
        let targetuid = row.children[1].id;

        deals.forEach(function (item, index, arr) {
            if (item.uid === targetuid) {
                Object.preventExtensions(item);

                item['isPawn'] = row.children[4].children[0].checked;//checked box

                func1(item, row, 'cname', 2);
                func2(item, row, 'num', 3);
                func2(item, row, 'handlingfee', 5);
                func2(item, row, 'shares', 6);
                func1(item, row, 'buydate', 7);
                func2(item, row, 'buyprice', 8);
                func1(item, row, 'selldate', 11);
                func2(item, row, 'sellprice', 12);
                func2(item, row, 'correction', 15);

                //console.log(row.children[2].children);

            }
        });

        chrome.storage.local.set({ deals: deals }, function () {
            rerender();
        });
    });

}

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

    let intputborder = "";
    let isreadonly = "";
    let isdisabled = "";
    if (deal.isLock) {
        intputborder = "border: 0;";
        isreadonly = "readonly='readonly'";
        isdisabled = "disabled"
    }

    let template = `
    <tr id="row101" class='row1'>
        <th axis="NO" scope="row" class='handle'>${NO}</th>        
        <th axis="uid" style="display:none" id="${deal.uid}"></th>                
        <td axis="cname">${deal.cname}</td>
        <td axis="num">${deal.num}</td>       
        <td axis="isPawn"><input ${isreadonly} style="width:50px; ${intputborder}" type="checkbox" ${ischecked} ${isdisabled}></td>
        <td axis="handlingfee">${deal.handlingfee}</td>
        <td axis="shares">${deal.shares}</td>
        <td axis="bdate" >${deal.buydate}</td>
        <td axis="buyprice">${deal.buyprice}</td>
        <td axis="buycost">${buycost}</td>
        <td axis="buyallmoney">${buyallmoney}</td>
        <td axis="sdate" style="border-left:5px black solid ;">${deal.selldate}</td>
        <td axis="sellprice">${deal.sellprice}</td>
        <td axis="sellcost">${sellcost}</td>
        <td axis="sellallmoney">${sellallmoney}</td>        
        <td axis="collection">${deal.correction}</td>
        <td style="background-color: ${plcolor};" name="pl" style="width:100px;">${pl}</td>
        <td style="background-color: ${plcolor};" name="percentage" style="width:100px;">${percentage}</td>
        <td axis="totalpl" style="width:100px;">${totalpl}</td>
        <td  style="width: 50px;" >
            <button type="button" class="btn1 btn-primary" style="display:none">ok</button>
            <button name="btnClone" type="button" class="btn1 btn-success">clone</button>
            <button type="button" class="btn1 btn-info">lock</button>
            <button type="button" class="btn1 btn-danger">del</button>
        </td>        
        
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
    //console.log('re');
    createRows();
    //location.reload();
}




function getisLockByUID(deals, uid) {
    for (let i = 0; i < deals.length; i++) {
        if (uid === deals[i].uid) {
            return !deals[i].isLock;
        }
    }
}