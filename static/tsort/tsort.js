// alert('dfs!');
var matrix = [...Array(20)].map(e => Array(20).fill(0));
var nodes = new Array(20);
var pos = new Array(20);
var state=new Array(20);
var nodecount =new Array(20);
var order;
var check;
nodes.fill(0);

var counter=0;
//nodes coordinates
let coods=[
    [50,70],
    [195,50],
    [65,180],
    [190,195],
    [275,125],
    [400,75],
    [425,200],
    [300,275],
    [150,300],
    [60,400],
    [250,390],
    [464,357],
    [563,158],
    [655,327],
    [739,128],
    [825,398],
    [769,259],
    [850,200],
    [550,300],
    [850,80]
];

//shuffle function
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//add node in svg
function addNode(val,x,y)
{
    d3.select(`#node${val-1}`).remove();

    const svg = d3.select('svg');

    const g= svg.append('g')
                .attr('id',`node${val-1}`);

    const c = g.append('circle')
                .attr('cx',`${x}`)
                .attr('cy',`${y}`)
                .attr('r',25)
                .style('fill','white')
                .attr('stroke','#383F51')
                .attr('stroke-width','2px');

    const t =g.append('text')
                .attr('x',`${x}`)
                .attr('y',`${y}`)
                .text(val)
                .attr('fill','#383F51')
                .attr('alignment-baseline',"central")
                .attr('text-anchor','middle')
                .attr('font-size','20px')
                .style('font-weight','bold');

}

function addNodeTsort(val,x,y)
{
    d3.select(`#node${val-1}tsort`).remove();

    const svg = d3.select('svg');

    const g= svg.append('g')
            .attr('id',`#node${val-1}tsort`);

    const c = g.append('circle')
                .attr('cx',`${x}`)
                .attr('cy',`${y}`)
                .attr('r',25)
                .style('fill','#F5F2B8')
                .attr('stroke','#383F51')
                .attr('stroke-width','2px');

    const t =g.append('text')
                .attr('x',`${x}`)
                .attr('y',`${y}`)
                .text(val)
                .attr('fill','#383F51')
                .attr('alignment-baseline',"central")
                .attr('text-anchor','middle')
                .attr('font-size','20px')
                .style('font-weight','bold');

}

// add edge in svg
function createEdge(x,y,undirected)
{
    d3.select(`#edge${x}${y}`).remove;
    if(!nodes[x])
    {
        cood=coods.pop();
        // addNode(x+1,cood[0],cood[1]);
        pos[x]=[];
        pos[x][0]=cood[0];
        pos[x][1]=cood[1];
    }

    if(!nodes[y])
    {
        cood=coods.pop();
        
        pos[y]=[];
        pos[y][0]=cood[0];
        pos[y][1]=cood[1];
    }

    const g=d3.select('svg').append('g')
            .attr('id',`edge${x}${y}`);
    var x1=pos[x][0], y1=pos[x][1], x2=pos[y][0], y2=pos[y][1];

    midx1=(x1+x2)/2;
    midy1=(y1+y2)/2;
    
    if(undirected)
    {
        toss =Math.floor(Math.random()*2);
        if(toss)
        {
            midx1+=25;
            midy1+=25;
        }
        else 
        {
            midx1-=25;
            midy1-=25;
        }
        g.append('path')
            .attr('d',`M ${x1} ${y1} S ${midx1} ${midy1} ${x2} ${y2}`)
            .attr('stroke','black')
            .attr('fill','none');
    }

    else
    {
        g.append('path')
        .attr('d',`M ${x1} ${y1} L ${x2} ${y2}`)
        .attr('stroke','black')
        .attr('fill','none');
    
        var m=(y2-y1)/(x2-x1);
        var deg = Math.atan(m);
        deg=(deg/Math.PI)*180;

        if(x2<x1)
        {
            g.append('polygon')
            .attr('transform',`translate(${midx1} ${midy1}) rotate(${270+deg})`)
            .attr('points',"0,0 -7,14 7,14");
        }

        else
        {
            g.append('polygon')
            .attr('transform',`translate(${midx1} ${midy1}) rotate(${90+deg})`)
            .attr('points',"0,0 -7,14 7,14");
        }
    }
    
    addNode(y+1,x2,y2);
    addNode(x+1,x1,y1);
}

function createEdgeTsort(x,y,curve)
{
    const svg=d3.select('svg');
    var x1=20+(90*x), y1=700, x2=20+(90*y), y2=700;

    midx1=(x1+x2)/2;
    midy1=(y1+y2)/2;

    if(curve)
    {
        midy1-=100;

        var m=(y2-y1)/(x2-x1);
        var deg = Math.atan(m);
        deg=(deg/Math.PI)*180;

        svg.append('path')
            .attr('id',`edge${x}${y}`)
            .attr('d',`M ${x1} ${y1} S ${midx1} ${midy1} ${x2} ${y2}`)
            .attr('stroke','black')
            .attr('fill','none');

            if(x2<x1)
            {
            svg.append('polygon')
                .attr('transform',`translate(${midx1} ${midy1+56}) rotate(${270+deg})`)
                .attr('points',"0,0 -7,14 7,14");
            }
    
            else
            {
                svg.append('polygon')
                .attr('transform',`translate(${midx1} ${midy1+56}) rotate(${90+deg})`)
                .attr('points',"0,0 -7,14 7,14");
            }
    }

    else
    {
        svg.append('path')
        .attr('id',`edge${x}${y}`)
        .attr('d',`M ${x1} ${y1} L ${x2} ${y2}`)
        .attr('stroke','black')
        .attr('fill','none');
    
        var m=(y2-y1)/(x2-x1);
        var deg = Math.atan(m);
        deg=(deg/Math.PI)*180;

        if(x2<x1)
        {
        svg.append('polygon')
            .attr('transform',`translate(${midx1} ${midy1}) rotate(${270+deg})`)
            .attr('points',"0,0 -7,14 7,14");
        }

        else
        {
            svg.append('polygon')
            .attr('transform',`translate(${midx1} ${midy1}) rotate(${90+deg})`)
            .attr('points',"0,0 -7,14 7,14");
        }
    }


}
//dfs function
function TSORT(node)
{
    //apply transition
    console.log(node);
    state[node]=1;
    nodecount.push([node,1]);
    for(var i=0;i<20;i++)
    {
        if(matrix[node][i])
        {
            if(!state[i])
                TSORT(i);

            else if(state[i]==1)
                check=true;
        }
    }

    state[node]=2;
    nodecount.push([node,2]);
    order.push(node);
}

function createTsort()
{
    d3.select('#tsorttext').remove();

    d3.select('svg').append('text')
        .text("Topological Sort: ")
        .attr('id','tsorttext')
        .attr('x',0)
        .attr('y',600)
        .attr('font-size','30px');
    
    var prev = new Array(20);
    prev.fill(0);
    for(var i=0;i<order.length;i++)
    {
        if(i)
        {
            for(var j=0;j<20;j++)
            {
                if(matrix[j][order[i]] && prev[j])
                {
                    if(j==order[i-1])
                    {
                        createEdgeTsort(i-1,i,0);
                    }

                    else
                    {
                        createEdgeTsort(prev[j]-1,i,1);
                    }

                }
            }
        }

        prev[order[i]]=i+1;
    }

    for(var i=0;i<order.length;i++)
    {
        addNodeTsort(order[i]+1,20+(90*i),700);
    }
}

document.addEventListener('DOMContentLoaded',function(){
    var box=document.querySelector('#tsort');
    box.style.color='white';
    box.style.backgroundColor = '#383F51';
    shuffle(coods);

    document.querySelector('#edgeform').onsubmit = function(){
        const start=document.querySelector('#start').value;
        const end=document.querySelector('#end').value;
        document.querySelector("#edgeerror").innerHTML="";
        document.querySelector("#starterror").innerHTML="";
        document.querySelector("#enderror").innerHTML="";

        var undirected=false;

        if(start<1 || start>10)
        {
            document.querySelector("#starterror").innerHTML="Node Value must be between 1 and 10";
            return false;
        }

        if(end<1 || end>10)
        {
            document.querySelector("#enderror").innerHTML="Node Value must be between 1 and 10";
            return false;
        }

        if(matrix[start-1][end-1] || (undirected && matrix[end-1][start-1]))
        {
            document.querySelector("#edgeerror").innerHTML="You cannot add the same edge twice.";
            return false;
        }

        if(start==end)
            return false;

        matrix[start-1][end-1]=1;

        if(undirected)
            matrix[end-1][start-1]=1;

        createEdge(start-1,end-1,undirected);

        nodes[start-1]=1;
        nodes[end-1]=1;

        const li = document.createElement('li');
        if(undirected)
            li.innerHTML=start+" "+end+" Undirected";
        else
            li.innerHTML=start+" "+end+" Directed";

        document.querySelector("#edgelist").append(li);
        
        return false;
    };

    //run algorithm
    document.querySelector('#run').onclick=function(){
        document.querySelector('svg').innerHTML="";

        for(var i=0;i<20;i++)
        {
            for(var j=0;j<20;j++)
            {
                if(matrix[i][j])
                    createEdge(i,j,0);
            }
        }
        const svg = d3.select('svg');
        d3.selectAll('.legend').remove();

        //legends
        svg.append('rect')
            .attr('class','legend')
            .attr('x',500)
            .attr('y',500)
            .attr('width',20)
            .attr('height',20)
            .attr('stroke','#383F51')
            .attr('stroke-width','2px')
            .attr('fill','white');
        svg.append('text')
            .attr('class','legend')
            .attr('x',530)
            .attr('y',515)
            .text('Unprocessed');

            svg.append('rect')
            .attr('class','legend')
            .attr('x',650)
            .attr('y',500)
            .attr('width',20)
            .attr('height',20)
            .attr('stroke','#383F51')
            .attr('stroke-width','2px')
            .attr('fill','#F5F2B8');
        svg.append('text')
            .attr('class','legend')
            .attr('x',680)
            .attr('y',515)
            .text('Processing');

            svg.append('rect')
            .attr('class','legend')
            .attr('x',800)
            .attr('y',500)
            .attr('width',20)
            .attr('height',20)
            .attr('stroke','#383F51')
            .attr('stroke-width','2px')
            .attr('fill','#f35757');
        svg.append('text')
            .attr('class','legend')
            .attr('x',830)
            .attr('y',515)
            .text('Processed');
        
        //initialize
        state.fill(0);
        nodecount=[];
        order=[];
        svg.selectAll('g').select('circle')
                    .style('fill','white')
        counter=0;

        //check for cycles
        check=false;

        document.querySelector('#edgebtn').disabled=true;
        document.querySelector('#run').disabled=true;
        //run tsort
        for(var i=0;i<20;i++)
        {
            if(nodes[i] && !state[i])
                TSORT(i);
        }

        window.scrollTo(0,100);
        order.reverse();
        console.log(order);

        while(nodecount.length)
        {
            var top=nodecount.shift();

            if(top[1]==1)
            {
                d3.select(`#node${top[0]}`).select('circle').transition()
                    .delay(1000*counter)
                    .duration(1000)
                    .style('fill','#F5F2B8')
            }

            else
            {
                d3.select(`#node${top[0]}`).select('circle').transition()
                    .delay(1000*counter)
                    .duration(1000)
                    .style('fill','#f35757')
            }

            counter++;
        }

        if(!check)
            createTsort();
        else
        {
            d3.select('#tsorttext').remove();
            svg.append('text')
            .text("Cycle Detected.")
            .attr('id','tsorttext')
            .attr('x',0)
            .attr('y',600)
            .attr('font-size','30px');
        }

        setInterval(function(){
            document.querySelector('#edgebtn').disabled=false;
            document.querySelector('#run').disabled=false;
        },1000*counter);

    };

    //clear graph
    document.querySelector('#clear').onclick=function(){
        document.querySelector('svg').innerHTML="";

        document.querySelector('#edgebtn').disabled=false;
            document.querySelector('#run').disabled=false;

        for(var i=0;i<20;i++)
        {
            nodes[i]=0;
            for(var j=0;j<20;j++)
            {
                matrix[i][j]=0;
            }
        }


        window.scrollTo(0,0);
        document.querySelector('#edgelist').innerHTML="";
    };

});