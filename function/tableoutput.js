/**
 * Created by wfsovereign on 14-11-12.
 */
$(document).ready(function(){

    $(".items_list").append(table_output());
    $(".add").on('click',storage_bar)
});
var inputs=[];
var shopcart_num=0;
localStorage.setItem("shopcart_number",0);
function storage_bar(){
   // localStorage.setItem("input_list",[]);
    //var inp_list =localStorage.getItem("input_list");
    inputs.push($(this).data("barcode"));
    shopcart_num+=1;
    sessionStorage.setItem("shopcart_number",shopcart_num);
    sessionStorage.setItem("barcodes",inputs);
    $(".shopcart_num").html(shopcart_num);
}
function table_output() {
    var allitem= loadAllItems();
    var out = "";
    _.each(allitem, function (item) {
        out = out +
            '<tr>' +
            '<td>' + item.category + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.price + '</td>' +
            '<td>' + item.unit + '</td> ' +
            "<td><button class='add btn btn-primary' data-barcode = '"+item.barcode+"'>加入购物车</button>" + '</td>' +
            '</tr>'
    });
    return out;
}