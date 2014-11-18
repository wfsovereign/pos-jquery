/**
 * Created by wfsovereign on 14-11-14.
 */


function find_item_by_barcode(barcode) {
    return _(loadAllItems()).findWhere({"barcode":barcode})
}

function build_cart_items_from_inputs(){
    var items =loadAllItems();
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
            name:item.name,
            count:element.count,
            unit:item.unit,
            category:item.category,
            price:item.price
        }
    }).value();
    /*
     var tem= _.groupBy(inputs_array,function(input){
     return input;
     });
     var tem1= _.map(tem,function(value,key)
     {
     return {barcode:key,count:value.length}

     });

    var tem3= _.map(tem2,function(element){
        var item = find_item_by_barcode(element.barcode);
        return{
            name:item.name,
            count:element.count,
            unit:item.unit,
            category:item.category,
            price:item.price
        }

    });*/
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

function payment_output(){

    var payment_string="";
    payment_string = "<a href=''><button class='btn btn-primary btn-lg' >付款</button></a>";
    return payment_string
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

var tem  = build_cart_items_from_inputs();
var tem2 = classify_by_category(tem);
var tem3 = _.map(tem,function(value,key){
    var category_title = key;
    var commodity_list = value;
    return {
        category_title:category_title,
        commodity_list:commodity_list
    }

});
console.log(tem2);
console.log(tem3[2].commodity_list[0]);
*/



$(function(){
    $(".purchase_commodity_list").append(purchase_commodity_list_frame_output());
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    $(".水果").append(commdity_table_mainbody_output("水果"));
    $(".饮料").append(commdity_table_mainbody_output("饮料"));
    $(".生活用品").append(commdity_table_mainbody_output("生活用品"));
    $(".食品").append(commdity_table_mainbody_output("食品"));

    $(".subtotal").html(subtotal_string());
    $(".payment").append(payment_output());


});

function commdity_table_mainbody_output(classify){
    var classify_commodity=get_classsify_commodity();

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
                "</td><td>" +"<div class='btn-group' ><button type='button' class='btn btn-default'>-</button><span class='btn btn-default'>"+
                commodity.count+
                "</span><button type='button' class= 'btn btn-default'>+</button></div>"+
                "</td><td>" +commodity.count*commodity.price+
                "</td></tr>";

        });
    }

    /*if(commodity_list_from_category !=null){

        _.each(commodity_list_from_category,function(commodity){
            main_body_output=main_body_output+
                "<tr ><td>" +commodity.name+
                "</td><td>" +commodity.price+
                "</td><td>" +commodity.unit+
                "</td><td>" +"<div class='btn-group' ><button type='button' class='btn btn-default'>-</button><span class='btn btn-default'>"+
                commodity.count+
                "</span><button type='button' class= 'btn btn-default'>+</button></div>"+
                "</td><td>" +commodity.count*commodity.price+
                "</td></tr>";

        });
    }*/
    return main_body_output;
}

function get_classsify_commodity(){
    var purchase_commodity_list = build_cart_items_from_inputs();
    return classify_by_category(purchase_commodity_list);
}

function purchase_commodity_list_frame_output() {
    var classify_commdotiy = get_classsify_commodity();//classify_by_category(purchase_commodity_list);
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
                table_list[i]=table_frame_first+classify_commdotiy[i].category_title+table_frame_second+ classify_commdotiy[i].category_title+ table_frame_last;
        }
    }
    return  table_list
}

