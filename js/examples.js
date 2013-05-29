/**
 * @file examples.js
 *****************************/

!function(){

/**
 * tab
 ***********************/
TCent.behaviors.tab = {
  attach : function(){
    fish.all('.tab').once('tab', function(){
      fish.one(this).tab();
    });
  }
}

/**
 * alert
 *************************/
TCent.behaviors.alert = {
  attach : function(){
    fish.all('.alert').once('alert', function(){
      fish.all('.close', this).on('click', function(e){
        fish.preventDefault(e);
        fish.one(this).getParent('.alert').html('remove');
      })
    })
  }
}


/**
 * slider
 *************************/
TCent.behaviors.slider = {
  attach : function(){
    fish.all('.slider').once('slider',function(){
      fish.one(this).mSlider({
        autoScroll: false,
        prevBtn:'.prev',
        nextBtn:'.next',
        arrows: true,
        scrollNum:1,
        content: ".slider-item",
        canvas: ".slider-items"
      });

      // 为按钮添加preventDefault，这样就能添加href，ie6中就能有hover属性了。
      fish.all('.browse',fish.one(this)).on('click',function(e){
        fish.preventDefault(e);
      });
    })
  }
}

}();
