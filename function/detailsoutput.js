/**
 * Created by wfsovereign on 14-11-19.
 */
var cart_items =JSON.parse(sessionStorage.getItem("commodity_cart_items"));




$(function(){
    $(".commodity_list").append(main_body_output());
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    //$(".details").append(promotion_commodity_frame_output());
   // $(".promotionlist").append(promotion_commodity_output());
});


function main_body_output(){
    if(judge_exist_promotion_commodity()==false){
        var mainbody_string;
        mainbody_string=commodity_output();
        $(".subtotal").html(subtotal_string());

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
                item.subtotal_after_promotion = (item.count-item.givecount)*item.price;
            }else{
                item.subtotal = item.count*item.price;
            }
        });
        _.each(cart_items,function(item){
            if(item.givecount>0){
                item.subtotalstr = postfix_to_subtotal_after_promotion(item);
            }else{
                item.subtotalstr = postfix(item.subtotal);
            }
        });

        var body_string;
        body_string="";

        _.each(cart_items,function(item){
            if(item.givecount>0){
                body_string=body_string+
                    "<tr ><td>" +item.category+
                    "</td><td>" +item.name+
                    "</td><td>" +item.price+
                    "</td><td>" +item.unit+
                    "</td><td>" +item.count+
                    "</td><td>" +item.subtotalstr+
                    "</td></tr>";
            }else if(item.count>0){
                body_string=body_string+
                    "<tr ><td>" +item.category+
                    "</td><td>" +item.name+
                    "</td><td>" +item.price+
                    "</td><td>" +item.unit+
                    "</td><td>" +item.count+
                    "</td><td>" +item.subtotalstr+
                    "</td></tr>";
            }

        });
        $(".promotionlist").append(promotion_commodity_output());
        $(".subtotal").html(subtotal_string());
        console.log(judge_exist_savemoney() )
        if(judge_exist_savemoney() ==true){
            $(".savemoney").html(savemoney_string());
            $(".actualpayment").html(actualpayment_string());
        }
        return body_string;
    }

}



function commodity_output(){
    _.each(cart_items,function(item){
        item.subtotal = item.count*item.price;
        item.subtotalstr = postfix(item.subtotal);
    });
    var commodity_string="";
    _.each(cart_items,function(item){
        commodity_string=commodity_string+
            "<tr ><td>" +item.category+
            "</td><td>" +item.name+
            "</td><td>" +item.price+
            "</td><td>" +item.unit+
            "</td><td>" +item.count+
            "</td><td>" +item.subtotalstr+
            "</td></tr>";
    });
    return commodity_string;
}


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

function postfix_to_subtotal_after_promotion(item){
    var display_subtotal="";
    display_subtotal = postfix(item.subtotal_after_promotion)+"(原价："+postfix(item.subtotal)+")";
    return display_subtotal
}

function subtotal_string(){
    var subtotal=0;
    _.each(cart_items,function(item){
            subtotal+=item.subtotal;
    });
    subtotal="总计："+postfix(subtotal);
    return subtotal
}

function savemoney_string(){
    var savemoney=0;
    _.each(cart_items,function(item){
        if(item.givecount>0){
            savemoney+=item.price*item.givecount;
        }
    });
    savemoney="节省："+postfix(savemoney);
    return savemoney
}

function actualpayment_string(){
    var actualpayment =0;
    _.each(cart_items,function(item){
        if(item.subtotal_after_promotion!=undefined &&item.subtotal_after_promotion != item.subtotal){
            actualpayment+=item.subtotal_after_promotion;
        }else{
            actualpayment+=item.subtotal;
        }
    });
    actualpayment="实付："+postfix(actualpayment);
    return actualpayment
}

function judge_exist_savemoney(){
    var judge_value;
     _.each(cart_items,function(item){
        if(item.givecount>0){
            judge_value = true
        }
    });
    return judge_value
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