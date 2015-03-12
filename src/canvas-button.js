/*options { btn_name:"A Button", points:[{x:0,y:0},{x:1,y:1},...] }*/
var CanvasButton = function (x,y,size,options){
                        
    
    this.x = x || 0;
    this.y = y || 0;
    this.size = size || 1;
    this.btn_name = options.btn_name || "A button";
    this.points = options.points || [
        {x:this.x+(1*this.size),y:this.y},
        {x:this.x+(3*this.size),y:this.y},
        {x:this.x+(4*this.size),y:this.y+(1.75*this.size)},
        {x:this.x+(3*this.size),y:this.y+(3.5*this.size)},
        {x:this.x+(1*this.size),y:this.y+(3.5*this.size)},
        {x:this.x,y:this.y+(1.75*this.size)}
    ];

    

};

CanvasButton.prototype.draw = function (ctx) {

    var canvas_context = ctx;

    canvas_context.beginPath();                        
    canvas_context.moveTo(this.points[0].x,this.points[0].y);
    for(var i = 1; i<this.points.length; i++){

        canvas_context.lineTo(this.points[i].x,this.points[i].y);

    }
    canvas_context.closePath();

    canvas_context.fill();



};
CanvasButton.prototype.handleClick = function (mouse) {

    if(this.containsPoint(this.points,mouse)) {


        window.console.log(this.btn_name+" was clicked and center is at "+this.getCenter().x+" "+this.getCenter().y);
        return true;

    }


};
CanvasButton.prototype.handleHover = function (mouse) {


    if(this.containsPoint(this.points,mouse)){


        window.console.log(this.btn_name+" in Under the cursor and center is at "+this.getCenter().x+" "+this.getCenter().y);
        return true;

    }

};
CanvasButton.prototype.getCenter = function () {

    return { x: (this.x+(4*this.size))/2, y: (this.y+(3.5*this.size))/2 };

};
CanvasButton.prototype.containsPoint = function(p, pb){


    var n = p.length;
    var ax, ay = p[n-2].y-pb.y, bx = p[n-1].x-pb.x, by = p[n-1].y-pb.y;

    //var lup = by > ay;
    for(var i=0; i<n; i++) {

        ax = bx;  ay = by;
        bx = p[i].x - pb.x;
        by = p[i].y - pb.y;
        if(ay==by) continue;
        lup = by>ay;

    }

    var depth = 0;
    for(var i=0; i<n; i++){
        ax = bx;  ay = by;
        bx = p[i].x - pb.x;
        by = p[i].y - pb.y;
        if(ay< 0 && by< 0) continue;	// both "up" or both "down"
        if(ay> 0 && by> 0) continue;	// both "up" or both "down"
        if(ax< 0 && bx< 0) continue; 	// both points on the left

        if(ay==by && Math.min(ax,bx)<=0) return true;
        if(ay==by) continue;

        var lx = ax + (bx-ax)*(-ay)/(by-ay);
        if(lx==0) return true;			// point on edge
        if(lx> 0) depth++;
        if(ay==0 &&  lup && by>ay) depth--;	// hit vertex, both up
        if(ay==0 && !lup && by<ay) depth--; // hit vertex, both down
        lup = by>ay;
    }
    //console.log(depth);

    return (depth & 1) == 1;

};

