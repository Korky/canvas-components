/*BobRoss is the internal base object for CanvasPlayer .. this next phrase defines the entire ideology of the design of this project "everybody inherits from BobRoss" */
var BobRoss = {
  
    position:{x:0,y:0},
    type:"BobRoss Object",
    name:"display",
    points:[],
    fillColor:"#000000",
    draw:function(ctx){
        var canvas_context = ctx;
        canvas_context.beginPath();                        
        canvas_context.moveTo(this.points[0].x,this.points[0].y);
        for(var i = 1; i<this.points.length; i++){
            canvas_context.lineTo(this.points[i].x,this.points[i].y);
        }
        canvas_context.closePath();
        canvas_context.fill();
    },
    handleEvent:function(eventType,input){
        switch(eventType){
                case 'MouseEvent':
                    if(this.containsPoint(intput)) return true;
                break;     
        }
    },
    containsPoint:function(pb){
        var p = this.points;
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
    }
};
