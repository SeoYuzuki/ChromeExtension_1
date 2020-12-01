var ans = '';
var next = 0;

function nextTurn() {
    next = getNext();

    cleanToBlack();


    makeQuestion();

}
function cleanToBlack() {
    document.getElementById('op1').style = "color:black";
    document.getElementById('op2').style = "color:black";
    document.getElementById('op3').style = "color:black";
    document.getElementById('op4').style = "color:black";
}

function makeQuestion() {
    let s = getList()[next];
    ans = s[1];
    document.getElementById('jojo').innerText = s[0] + '. ' + s[2];
    document.getElementById('op1').innerText = s[3];
    document.getElementById('op2').innerText = s[4];
    document.getElementById('op3').innerText = s[5];
    document.getElementById('op4').innerText = s[6];

    console.log(ans);

}



function getNext() {
    if (document.getElementById('dd').innerText == '隨機') {
        return Math.floor(Math.random() * getList().length);
    } else {
        if (next == getList().length) {
            return 0;
        }
        return next + 1;
    }

}

function whenWrong() {
    let id = 'op' + ans;
    document.getElementById(id).style = "color:red";
}


function changeOrder() {
    if (document.getElementById('dd').innerText == '隨機') {
        document.getElementById('dd').innerText = '順序';
    } else {
        document.getElementById('dd').innerText = '隨機';
    }
}

document.addEventListener('keydown', function (event) {

    //console.log(event.keyCode);
    if (event.keyCode == '49' || event.keyCode == '97') { // 1
        if (ans == '1') {
            nextTurn();
        } else {
            whenWrong();
        }
    }

    if (event.keyCode == '50' || event.keyCode == '98') { // 2
        if (ans == '2') {
            nextTurn();
        } else {
            whenWrong();
        }
    }
    if (event.keyCode == '51' || event.keyCode == '99') { // 3
        if (ans == '3') {
            nextTurn();
        } else {
            whenWrong();
        }
    }
    if (event.keyCode == '52' || event.keyCode == '100') { // 4
        a777();
        if (ans == '4') {
            nextTurn();
        } else {
            whenWrong();
        }
    }


});
nextTurn();

$("#toN").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        cleanToBlack()
        next = parseInt($("#toN").val()) - 1;
        makeQuestion();
        $("#toN").val('');
    }
});

$("#dd").click(function () {
    changeOrder();
});