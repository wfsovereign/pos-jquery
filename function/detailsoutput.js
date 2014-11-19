/**
 * Created by wfsovereign on 14-11-19.
 */

$(function(){
    $(".commodity_list").append(main_body_output());
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    //$(".details").append(promotion_commodity_frame_output());
   // $(".promotionlist").append(promotion_commodity_output());
});

function commodity_output(){
    var commodity_string="";
    _.each(cart_items,function(item){
        commodity_string=commodity_string+
            "<tr ><td>" +item.category+
            "</td><td>" +item.name+
            "</td><td>" +item.price+
            "</td><td>" +item.unit+
            "</td><td>" +item.count+
            "</td><td>" +item.count*item.price+
            "</td></tr>";
    });
    return commodity_string;

}
var cart_items =JSON.parse(sessionStorage.getItem("commodity_cart_items"));
console.log(cart_items)
function judge_decimal(integer){
    return (Math.ceil(integer) > integer)
}

function postfix(value){
    if(judge_decimal(value)){

        return (value+"0(元)")
    }else{
        return (value+".00(元)")
    }
}

function get_subtotal_str_before_promotion(item){

}

function main_body_output(){
    if(judge_exist_promotion_commodity()==false){
        var mainbody_string;
        mainbody_string=commodity_output();

        return mainbody_string;
    }else{
        $(".details").append(promotion_commodity_frame_output());
        _.each(cart_items,function(item){
            add_preferential_information_to_item(item);
        });
        _.each(cart_items,function(item){
            if(item.preference_information =='BUY_TWO_GET_ONE_FREE'){
                item.givecount = Math.floor(item.count/3)
            }
        });
        _.each(cart_items,function(item){
            if(item.preference_information != undefined){
                item.subtotal = item.count*item.price;
                item.subtotal_before_promotion = (item.count-item.givecount)*item.price;
            }else{
                item.subtotal = item.count*item.price;
            }
        });

        var body_string;
        body_string="";
        _.each(cart_items,function(item){
            if(item.type !=undefined){

            }
        });
        _.each(cart_items,function(item){
            body_string=body_string+
                "<tr ><td>" +item.category+
                "</td><td>" +item.name+
                "</td><td>" +item.price+
                "</td><td>" +item.unit+
                "</td><td>" +item.count+
                "</td><td>" +item.count*item.price+
                "</td></tr>";
        });
        $(".promotionlist").append(promotion_commodity_output());
        return body_string;
    }

}

function promotion_commodity_frame_output(){

    var mainbody_strings="";
    mainbody_strings += "<div class= 'panel-heading' style='background-color: lightgrey'><h3 class='text-left'>赠送商品</h3></div> "+
        "<div class='panel-body'><table  class='table table-bordered text-center'><thead class='promotionlist' >"+
        "<tr ><td class='col-md-2'>分类</td><td class='col-md-3'>名称</td><td class='col-md-2'>数量</td></tr>"+
        "</thead></table></div>";

    return mainbody_strings;
}



function promotion_commodity_output(){

    var mainbody_strings="";
    _.each(cart_items,function(item){
        if(item.givecount!= undefined &&item.givecount!=0){
            mainbody_strings=mainbody_strings+
                "<tr ><td>" +item.category+
                "</td><td>" +item.name+
                "</td><td>" +item.givecount+
                "</td></tr>";
        }
    });
    return mainbody_strings;
}




function get_subtotal_string_of_have_givecount(){

}



function judge_exist_promotion_commodity() {
    var promote = loadPromotions();
    var judge_item_belong_promote = [];
    _.each(cart_items,function(item){
        judge_item_belong_promote.push(judge_exist_barcode(item,promote))
    });
    var item_truth= _.find(judge_item_belong_promote,function(truth){
        if(truth == true){
            return true
        }
    });
   return item_truth != undefined
}

function judge_exist_barcode(item,promote){
    var judge_bar;
    _.each(promote,function(pro){
         judge_bar=_.find(pro.barcodes,function(p){
            if(p ==item.barcode){
                return p;
            }
        });
    });
    return judge_bar != undefined
}

function add_preferential_information_to_item(item){
    var promote = loadPromotions();
    _.each(promote,function(pro){
        var judge_bar=_.find(pro.barcodes,function(p){
            if(p ==item.barcode){
                return p;
            }
        });
        if(judge_bar !=undefined) {
            item.preference_information = pro.type;
        }
    });

}