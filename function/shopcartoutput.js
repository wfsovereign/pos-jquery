/**
 * Created by wfsovereign on 14-11-14.
 */


function find_item_by_barcode(barcode) {
    return _(loadAllItems()).findWhere({"barcode":barcode})
}

function price_string_handle(price){
    if(Math.ceil(price)>price){
        var price_result = "总计："+price+"0元";
        return price_result
    }else{
        var price_result = "总计："+price+".00元";
        return price_result
    }
}

function build_cart_items_from_inputs(){
    if(sessionStorage.getItem("barcodes") != null){
        var inputs_array = sessionStorage.getItem("barcodes").split(",");
    }else{
        return null;
    }
    var purchase_commodity_list;
        purchase_commodity_list=_.chain(inputs_array).groupBy(function(inp){
        return inp;
    }).map(function(value,key){
        return {barcode:key,count:value.length}
    }).map(function(element){
        var item = find_item_by_barcode(element.barcode);
        return{
            barcode:item.barcode,
            name:item.name,
            count:element.count,
            unit:item.unit,
            category:item.category,
            price:item.price
        }
    }).value();
    return purchase_commodity_list;
}

function classify_by_category(commodity_list){
    if(commodity_list!=null){
        return _.chain(commodity_list).groupBy("category").map(function(value,key){
            var category_title = key;
            var commodity_list = value;
            return {
                category_title:category_title,
                commodity_list:commodity_list
            }
        }).value();
    }else{
        return null
    }
}

$(function(){
    $(".purchase_commodity_list").append(purchase_commodity_list_frame_output());
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    $(".水果").append(commdity_table_mainbody_output("水果"));
    $(".饮料").append(commdity_table_mainbody_output("饮料"));
    $(".生活用品").append(commdity_table_mainbody_output("生活用品"));
    $(".食品").append(commdity_table_mainbody_output("食品"));

    $(".subtotal").html(subtotal_string());
    //$(".payment").append(payment_output());


});
//
var purchase_commodity_list = build_cart_items_from_inputs();
var purchase_classify_by_category =classify_by_category(purchase_commodity_list);
sessionStorage.setItem("category_purchase_list",JSON.stringify(purchase_classify_by_category));
var classify_commdotiy = JSON.parse(sessionStorage.getItem("category_purchase_list"));
//classify_commdotiy[0].commodity_list[0].count=0;
//console.log(classify_commdotiy);

/*

var bar ="ITEM000000";
var cate = "饮料";
var classify_commodity_list = JSON.parse(sessionStorage.getItem("category_purchase_list"));
console.log(classify_commodity_list,"-------");
for(var i=0; i<classify_commodity_list.length;i++){
    if(classify_commodity_list[i].category_title ==cate){
        for(var j=0;j<classify_commodity_list[i].commodity_list.length;j++){
            if(classify_commodity_list[i].commodity_list[j].barcode == bar){
                classify_commodity_list[i].commodity_list[j].count+=1;
            }
        }
    }
}*/

/*
var update_commdity_list = _.find(classify_commodity_list,function(classify_list) {
    if (classify_list.category_title == cate) {
        var tem = classify_list.commodity_list;
        _.each(tem,function(t){
            if(t.barcode ==bar){
                t.count +=1;
            }
        });
    }
    return classify_commodity_list
});*/

/*
var update_commodity = _.chain(classify_commodity_list).find(function(classify){
    if(classify.category_title ==cate){
        console.log('1');
        return classify.commodity_list;
    }
}).find(function(commodity){
    if(commodity.barcode == bar){
        console.log('2');
        commodity.count+=1;
        return classify_commodity_list;
    }
}).value();
console.log(update_commodity,'========');
*/


/*
var update_commdity_list = _.find(classify_commodity_list,function(classify_list) {
    if (classify_list.category_title == cate) {
        var tem = classify_list.commodity_list;
        return tem;
    }
});
var tem = update_commdity_list.commodity_list;
var update_count =_.find(tem,function(commodity) {

    if (commodity.barcode == bar) {

        commodity.count += 1;
        return classify_commodity_list;
    }
});
    console.log(update_count,"2")
    console.log(update_commdity_list,"1");*/

/*var update_commdity_list = _.chain(classify_commodity_list).find(function(classify_list){
    if(classify_list.category_title ==cate){

        var tem = classify_list.commodity_list;
        return tem;
    }
}).find(function(commodity){
    console.log(commodity,"++++++")
    //console.log(commodity.barcode)
    if(commodity.barcode ==bar){
        console.log("2")
        commodity.count +=1;
        return classify_commodity_list;
    }
}).value();*/




function commdity_table_mainbody_output(classify){
    var classify_commodity=JSON.parse(sessionStorage.getItem("category_purchase_list"));

    var get_commodity_list_by_classify_name = _.find(classify_commodity,function(commodity){
        if(commodity.category_title == classify){
            return commodity.commodity_list;
        }
    });
    var main_body_output="";
    if(get_commodity_list_by_classify_name !=null){
        var commodity_list_from_category =get_commodity_list_by_classify_name.commodity_list;
        _.each(commodity_list_from_category,function(commodity){
            main_body_output=main_body_output+
                "<tr ><td>" +commodity.name+
                "</td><td>" +commodity.price+
                "</td><td>" +commodity.unit+
                "</td><td>" +"<div class='btn-group' ><button type='button' class='btn btn-default reduce' data-barcode = '"+commodity.barcode+
                "'data-category = '"+commodity.category+"'>-</button><span class='btn btn-default'>"+commodity.count+
                "</span><button type='button' class= 'btn btn-default raise' data-category='"+commodity.category+"' data-barcode='"+commodity.barcode+"'>+</button></div>"+
                "</td><td>" +commodity.count*commodity.price+
                "</td></tr>";

        });
    }
    return main_body_output;
}

function raise(){
    var bar = $(this).data("barcode");
    var cate = $(this).data("category");


}

function purchase_commodity_list_frame_output() {
    var classify_commdotiy = JSON.parse(sessionStorage.getItem("category_purchase_list"));//classify_by_category(purchase_commodity_list);
    if(classify_commdotiy!=null){
        var table_frame_first="<div class= 'container'> <div class='panel  panel-default'>" +
            "<div class= 'panel-heading' style='background-color: lightgrey'><h4 >";
        var table_frame_second ="</h4></div> <div class='panel-body'><table  class='table table-bordered text-center'>" +
            "<thead class=";
        var table_frame_last = "><tr ><td>名称</td>" +
        "<td>单价（元）</td>" +
        "<td>单位</td>" +
        "<td>数量</td>" +
        "<td>小计</td>" +
        "</tr></thead></table></div></div></div>";
        var table_list = [];
        var frame_number=classify_commdotiy.length;
        for(var i=0;i<frame_number;i++){
                table_list[i]=table_frame_first+classify_commdotiy[i].category_title+table_frame_second +
                    classify_commdotiy[i].category_title+ table_frame_last;
        }
    }
    return  table_list
}

function subtotal_string(){
    var commodity_list = build_cart_items_from_inputs();
    var subtotal = 0;
    _.each(commodity_list,function(commodity){
        subtotal = subtotal+commodity.price*commodity.count;
    });
    var subtotal_string;
    subtotal_string= price_string_handle(subtotal);
    return subtotal_string;
}

/*

function payment_output(){

    var payment_string="";
    payment_string = "<a href='"+"details.html"+"'><button class='btn btn-primary btn-lg' >付款</button></a>";
    return payment_string
}*/
