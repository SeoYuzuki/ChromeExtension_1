

function fnExcelReport() {
    let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    let textRange; var j = 0;
    let tab = document.getElementById('table1'); // id of table

    for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    //tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");

    let sa;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    }
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
}

function fnExcelReport2() {
    let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    let textRange; var j = 0;
    let tab = document.getElementById('table1'); // id of table

    for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    //tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    console.log(tab_text);
    

    return (sa);
}

$("#btn_download").on('click', function (e) {
    fnExcelReport()
});

$("#btn_serialize").on('click', function (e) {
    showSerialize()
});

function showSerialize() {
    console.log($("#table1"))
}