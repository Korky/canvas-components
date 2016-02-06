var CanvasPlayer = (function (doc) {
    
    var canvas = doc.getElementById('CanvasPlayer');
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.mouse = null;
    
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (doc.defaultView && doc.defaultView.getComputedStyle) {

        this.stylePaddingLeft = parseFloat(window.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10)      || 0;

        this.stylePaddingTop  = parseFloat(window.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10)       || 0;

        this.styleBorderLeft  = parseFloat(window.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10)  || 0;

        this.styleBorderTop   = parseFloat(window.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10)   || 0;

    }

    var html = doc.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;
    
    
    
    //keep track of state
    this.valid = false;
    this.objects = [];
    this.focusedObject = null;
    this.onTopOf =  null;

    
    
    this.clear = function(){ this.ctx.clearRect(0,0,this.width,this.height); };
    
    
    this.draw = function(ctx) {
         // if our player state is invalid, redraw and validate!
            if (!this.valid) {
                var ctx = this.ctx;        
                var objects = this.objects;
                var i = objects.length;
                this.clear();
                // ** Add stuff you want drawn in the background all the time here **
                // draw all objects
                while (i--) {
                    objects[i].draw(ctx);
                }
                // ** Add stuff you want drawn on top all the time here **
                this.valid = true;
            }
        
        
    };
    
    /**/
    var myPlayer = this;
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    
    canvas.addEventListener('change',function(e) {
    
        myPlayer.dispatchEvent(new MouseEvent('Change'));
        this.valid = false;
    
    },true);
    canvas.addEventListener('mousedown',function(e) {
    
        myPlayer.dispatchEvent(new MouseEvent('MouseDown'));
        this.valid = false;
        
    },true);
    canvas.addEventListener('mouseup',function(e) {
    
        myPlayer.dispatchEvent(new MouseEvent('MouseUp'));
        this.valid = false;
    
    },true);
    canvas.addEventListener('click', function(e) {
    
        myPlayer.dispatchEvent(new MouseEvent('MouseClick'));
        this.valid = false;
        
    },true);
    canvas.addEventListener('mousemove', function(e) {
    
        myPlayer.dispatchEvent(new MouseEvent('MouseMove'));
        this.valid = false;
    
    },true);


    this.interval = 3
    setInterval(function() { this.draw(); }, this.interval);
    
    return {
        
        children:this.objects,
        appendChild:function(obj){ this.objects.push(btn); this.valid = false; }
        
        
    };
    
    
})(document);