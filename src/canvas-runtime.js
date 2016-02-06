 
/*options {elemen_id:"CanvasPlayer", btnColor:"#CCCCCC", hoverColor:"#CCCEED", focusedObjectColor:"#CC0CCC" }*/
var CanvasPlayer = function(options){
    
    
    var canvas = document.getElementById("CanvasPlayer");
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {

        this.stylePaddingLeft = parseFloat(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;

        this.stylePaddingTop  = parseFloat(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;

        this.styleBorderLeft  = parseFloat(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;

        this.styleBorderTop   = parseFloat(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;

    }

    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    //keep track of state
    this.valid = false;
    this.objects = [];
    this.focusedObject = null;
    this.onTopOf =  null;

    /**/
    var myPlayer = this;
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);


    canvas.addEventListener('click', function(e) {

        var mouse = myPlayer.getMouse(e);
        var objects = myPlayer.objects;
        var i = objects.length;
        while (i--) {

            if (objects[i].handleClick(mouse)){

                var mySel = objects[i];
                myPlayer.focusedObject = mySel;
                myPlayer.valid = false;
                return;

            }

        }



    },true);

    canvas.addEventListener('mousemove', function(e) {



        var mouse = myPlayer.getMouse(e);
        var objects = myPlayer.objects;
        var l = objects.length;
            
        while (l--) {
            var btn = objects[l];
            if (btn.handleHover(mouse)){

                var mySel = btn;
                myPlayer.onTopOf = mySel;
                myPlayer.valid = false;
                
                return;
               
            } else {
              
                myPlayer.onTopOf = null;
                myPlayer.valid = false;
                
            }

        }

    },true);

    /*Player Options*/
    this.loader_name = "root";
    this.bgColor = options.bgColor || "#FFFFFF";
    /*this.hoverColor = options.hoverColor || "#CCCEED";*/
    this.focusedObjectColor = options.focusedObjectColor || "#CC0CCC";
    
    this.interval = 3;

    setInterval(function() { myPlayer.draw(); }, myPlayer.interval);
};
            
/*Methods*/
CanvasPlayer.prototype.addObject = function(btn){

    this.objects.push(btn);
    this.valid = false;

};

CanvasPlayer.prototype.clear = function(){

    this.ctx.clearRect(0,0,this.width,this.height);

};


CanvasPlayer.prototype.draw = function() {

    // if our menu state is invalid, redraw and validate!

    if (!this.valid) {

        var ctx = this.ctx;
        var objects = this.objects;
        var i = objects.length;
        this.clear();

        // ** Add stuff you want drawn in the background all the time here **

        // draw all objects
        var l = objects.length;
        ctx.fillStyle = this.btnColor;
        while (i--) {
            objects[i].draw(ctx);
        }

        
        //must eliminate form player code must handle object internally
        // draw hover
        if (this.onTopOf != null) {

            ctx.fillStyle = this.hoverColor;
            var myHov = this.onTopOf;
            myHov.draw(ctx);
            
        }

        // draw focusedObject
        if (this.focusedObject != null) {

            ctx.fillStyle = this.focusedObjectColor;
            var mySel = this.focusedObject;
            mySel.draw(ctx);
            
        }


        // ** Add stuff you want drawn on top all the time here **


        this.valid = true;

    }

};

CanvasPlayer.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    // Compute the total offset
    if (element.offsetParent !== undefined) {

        do {

            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;

        } while ((element = element.offsetParent));

    }
    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};

};


