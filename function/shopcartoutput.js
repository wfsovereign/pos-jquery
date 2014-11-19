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
    $(".raise").on('click',raise);
    $(".reduce").on('click',reduce);
    //$(".payment").append(payment_output());
});

var cart_items = build_cart_items_from_inputs();
//var purchase_classify_by_category =classify_by_category(build_cart_items_from_inputs());
sessionStorage.setItem("commodity_cart_items",JSON.stringify(cart_items));
//sessionStorage.setItem("category_purchase_list",JSON.stringify(purchase_classify_by_category));


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
                "</td><td>" +"<div class='btn-group ' ><input type='button' class='btn btn-default reduce'  value='-' data-name='"+commodity.name+"' data-barcode = '"+commodity.barcode+
                "'data-category = '"+commodity.category+"'><span class='btn btn-default number ' id='"+commodity.name+"'>"+commodity.count+
                "</span><input type='button' class='btn btn-default raise'  value='+' data-category='"+commodity.category+"' data-name='"+commodity.name+"' data-barcode='"+commodity.barcode+"'></div>"+
                "</td><td id='"+commodity.name+commodity.category+"'>" +commodity.count*commodity.price+
                "</td></tr>";//<input type="button" class="btn btn-default text-center" value="+" >
        });
    }
    return main_body_output;
}


function reduce(){
    var num= 0,subtotal= 0,judge_number =0;
    var bar = $(this).data("barcode");
    var commodity_name = $(this).data("name");
    var category_name = $(this).data("category");
    var sub = commodity_name+category_name;
    _.each(cart_items,function(item){
        if(item.barcode == bar ){
            if(item.count>0){
                item.count -=1;
                num = item.count;
                judge_number =num;
                subtotal = num*item.price;
                console.log(judge_number)
            }else{
                judge_number-=1;
            }
        }
    });
    if(judge_number >=0){
        sessionStorage.setItem("commodity_cart_items",JSON.stringify(cart_items));
        sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))-1);
        //var update_category_list = classify_by_category(cart_items);                  // this is error
        //sessionStorage.setItem("category_purchase_list",JSON.stringify(update_category_list));
        $("#"+commodity_name).html(num);
        $('#'+sub).html(subtotal);
        $(".subtotal").html(subtotal_string());
        $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    }

}

function raise(){
    var current_commodity_number= 0,subtotal=0;
    var bar = $(this).data("barcode");
    var commodity_name = $(this).data("name");
    var category_name = $(this).data("category");
    var sub = commodity_name+category_name;
    _.each(cart_items,function(item){
        if(item.barcode == bar){
            item.count +=1;
            current_commodity_number = item.count;
            subtotal = current_commodity_number*item.price;
        }
    });
    if(current_commodity_number>0){
        sessionStorage.setItem("commodity_cart_items",JSON.stringify(cart_items));
        sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
        //var update_category_list = classify_by_category(cart_items);
        //sessionStorage.setItem("category_purchase_list",JSON.stringify(update_category_list));
        $("#"+commodity_name).html(current_commodity_number);
        $('#'+sub).html(subtotal);
        $(".subtotal").html(subtotal_string());
        $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    }
}

function purchase_commodity_list_frame_output() {
    var classify_commdotiy = JSON.parse(sessionStorage.getItem("category_purchase_list"));//classify_by_category(purchase_commodity_list);
    if(classify_commdotiy!=null){
        var table_frame_first="<div class= 'container'> <div class='panel  panel-default'>" +
            "<div class= 'panel-heading' style='background-color: lightgrey'><h4 >";
        var table_frame_second ="</h4></div> <div class='panel-body'><table  class='table table-bordered text-center'>" +
            "<thead class=";
        var table_frame_last = "><tr >" +
        "<td class='col-md-2'>名称</td>" +
        "<td class='col-md-2'>单价（元）</td>" +
        "<td class='col-md-1'>单位</td>" +
        "<td class='col-md-3'>数量</td>" +
        "<td class='col-md-1'>小计</td>" +
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
    var subtotal = 0;
    _.each(cart_items,function(commodity){
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
