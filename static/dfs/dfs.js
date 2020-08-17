// alert('dfs!');
var matrix = [...Array(20)].map(e => Array(20).fill(0));
var nodes = new Array(20);
var pos = new Array(20);
var vis=new Array(20);
var nodecount =new Array(20);
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

    const svg=d3.select('svg');
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
        svg.append('path')
            .attr('id',`edge${x}${y}`)
            .attr('d',`M ${x1} ${y1} S ${midx1} ${midy1} ${x2} ${y2}`)
            .attr('stroke','black')
            .attr('fill','none');
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
    
    addNode(y+1,x2,y2);
    addNode(x+1,x1,y1);
}

//dfs function
function DFS(node)
{
    //apply transition
    console.log(node);
    vis[node]=1;
    counter++;

    nodecount[node]=counter;

    for(var i=0;i<20;i++)
    {
        if(matrix[node][i] && !vis[i])
            DFS(i);
    }
}


document.addEventListener('DOMContentLoaded',function(){
    var box=document.querySelector('#dfs');
    box.style.color='white';
    box.style.backgroundColor = '#383F51';
    shuffle(coods);

    document.querySelector('#edgeform').onsubmit = function(){
        const start=document.querySelector('#start').value;
        const end=document.querySelector('#end').value;
        document.querySelector("#edgeerror").innerHTML="";
        document.querySelector("#starterror").innerHTML="";
        document.querySelector("#enderror").innerHTML="";

        var undirected=document.querySelector('#undirected').checked;

        if(start<1 || start>20)
        {
            document.querySelector("#starterror").innerHTML="Node Value must be between 1 and 20";
            return false;
        }

        if(end<1 || end>20)
        {
            document.querySelector("#enderror").innerHTML="Node Value must be between 1 and 20";
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
        
        //initialise
        vis.fill(0);
        d3.selectAll('g').select('circle')
                    .style('fill','#F5F2B8')
        counter=0;
        
        document.querySelector('#edgebtn').disabled=true;
        document.querySelector('#run').disabled=true;
        //run dfs
        for(var i=0;i<20;i++)
        {
            if(nodes[i] && !vis[i])
                DFS(i);
        }

        window.scrollTo(0,0);
        for(var i=0;i<20;i++)
        {
            if(nodes[i])
            {
            const c = d3.select(`#node${i}`).select('circle');
                c.transition()
                .delay(1000*nodecount[i])
                .duration(1000)
                .style('fill','#f35757');
            }
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