// alert('dfs!');
var matrix = [...Array(20)].map(e => Array(20).fill(0));
var wtmatrix = [...Array(20)].map(e => Array(20).fill(0));
var nodes = new Array(20);
var pos = new Array(20);
var vis=new Array(20);
var nodecount =[];
var pqstates=[];
nodes.fill(0);

class PriorityQueue{
    constructor()
    {
        this.items=[];
    }

    par(x)
    {
        if(x)
            return Math.floor((x-1)/2);
        return x;
    }

    pqpush(item,priority)
    {
        this.items.push([item,priority]);

        var ind=this.items.length-1;

        if(!ind)
            return;

        while(this.items[this.par(ind)][1]>priority)
        {
            [this.items[this.par(ind)],this.items[ind]]=[this.items[ind],this.items[this.par(ind)]];
            ind=this.par(ind);
        }
    }

    heapify(i)
    {
        var l =2*i +1;
        var r =2*i +2;
        var smallest=i;

        if (l < this.items.length && this.items[l][1] < this.items[i][1]) 
            smallest = l; 
        if (r < this.items.length && this.items[r][1] < this.items[smallest][1]) 
            smallest = r; 

        if (smallest != i) 
        { 
            [this.items[i],this.items[smallest]]=[this.items[smallest],this.items[i]]; 
            this.heapify(smallest); 
        } 
    }

    pqpop()
    {
        var pqmin=this.items[0];
        if(this.items.length>1)
        {
            this.items[0]=this.items.pop();
            this.heapify(0);
        }
        else
            this.items.pop();
        return pqmin;
    }

    empty()
    {
        return this.items.length==0;
    }
}
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
    d3.select(`#dist${val-1}`).remove();

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


            if(val!=1)
            {
                const d= g.append('text')
                    .attr('id',`dist${val-1}`)
                    .attr('x',x)
                    .attr('y',y+40)
                    .text(`Dist=INF`)
                    .attr('text-anchor','middle');
            }

            
            else
            {
                g.append('text')
                    .attr('id',`dist${val-1}`)
                    .attr('x',x)
                    .attr('y',y+40)
                    .text(`Dist=0`)
                    .attr('text-anchor','middle');
            }

}

// add edge in svg
function createEdge(x,y,undirected,weight)
{
    if(!nodes[x])
    {
        cood=coods.shift();
        // addNode(x+1,cood[0],cood[1]);
        pos[x]=[];
        pos[x][0]=cood[0];
        pos[x][1]=cood[1];
    }

    if(!nodes[y])
    {
        cood=coods.shift();
        
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
    
    midx1=(x1+x2)/2;
    midy1=(y1+y2)/2;

    const w=svg.append('text')
            .attr('x',midx1)
            .attr('y',midy1)
            .text(weight)
    
            .attr('font-size','20px')
            .attr('font-weight','bold')
            .attr('fill','#7A918D');
    
    addNode(y+1,x2,y2);
    addNode(x+1,x1,y1);
}

//dfs function
function Djikstra()
{
    var dist=new Array(20);
    dist.fill(Infinity);
    dist[0]=0;

    var pq= new PriorityQueue;
    pq.pqpush(0,0);

    // console.log(pq.items);
    
    while(!pq.empty())
    {
        var copy=[...pq.items];
        pqstates.push(copy);

        var top=pq.pqpop();
        var node=top[0];
        var d=top[1];

        // console.log(top);
           
        if(vis[node])
            continue;
        vis[node]=true;
        nodecount.push(top);

        for(var ch=0;ch<20;ch++)
        {
            if(matrix[node][ch])
            {
                if(dist[node]+wtmatrix[node][ch]<dist[ch])
                {
                    dist[ch]=dist[node]+wtmatrix[node][ch];
                    pq.pqpush(ch,dist[ch]);
                }
            }
        }
    }

    console.log(dist);
}

document.addEventListener('DOMContentLoaded',function(){
    var box=document.querySelector('#djikstra');
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
        var weight=document.querySelector('#weight').value;

        if(weight=="")
            weight=0;

        weight=parseInt(weight);
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
        wtmatrix[start-1][end-1]=weight;

        if(undirected)
        {
            matrix[end-1][start-1]=1;
            wtmatrix[end-1][start-1]=weight;
        }
        createEdge(start-1,end-1,undirected,weight);

        nodes[start-1]=1;
        nodes[end-1]=1;

        const li = document.createElement('li');
        if(undirected)
            li.innerHTML=start+" "+end+" weight("+weight+") Undirected";
        else
            li.innerHTML=start+" "+end+" weight("+weight+") Directed";

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
        pqstates=[];
        nodecount=[];
        
        document.querySelector('#edgebtn').disabled=true;
        document.querySelector('#run').disabled=true;
        d3.select('#pq').remove();
        d3.select('#pqtext').remove()

        for(var i=0;i<20;i++)
        {
            const d= d3.select(`#dist${i}`);

            if(i)
                d.text('Dist=INF')
                .attr('font-weight','normal');
            else
                d.text('Dist=0')
                .attr('font-weight','normal');
        }

        d3.select('svg').append('text')
                        .attr('id','pqtext')
                        .attr('x',10)
                        .attr('y',500)
                        .text('Priority Queue (node, distance):')
                        .attr('font-size','30px');

        const pqt=d3.select('svg').append('g')
                    .attr('id','pq');
        //run djikstra
        Djikstra();

        console.log(pqstates);
        window.scrollTo(0,0);
        
        while(pqstates.length)
        {
            var pq=pqstates.shift();
            console.log(pq);
            
            pqt.selectAll(`.pq${counter-1}`).transition()
            .delay(2000*counter)
            .duration(0)
            .attr('font-size','0px');

            for(var i=0;i<pq.length;i++)
            {
                pqt.append('text')
                    .attr('class',`pq${counter}`)
                    .attr('x',10+(100*(i%9)))
                    .attr('y',Math.floor((i/9))*50+550)
                    .text(`(${pq[i][0]+1} , ${pq[i][1]}) `)
                    .attr('font-size','0px');
            }

            pqt.selectAll(`.pq${counter}`).transition()
                .delay(2000*counter)
                .duration(1000)
                .attr('font-size','20px');

            if(pq[0]==nodecount[0])
            {
                var top=nodecount.shift();

                d3.selectAll('circle').transition()
                .delay(2000*counter)
                .duration(1000)
                .style('fill','#F5F2B8');

                const c = d3.select(`#node${top[0]}`).select('circle');
                    c.transition()
                    .delay(2000*counter)
                    .duration(1000)
                    .style('fill','#f35757');

                d3.select(`#dist${top[0]}`).transition()
                .delay(2000*counter)
                .duration(2000)
                .text(`Dist=${top[1]}`)
                .attr('font-weight','bold');
            }
            counter++;
        }

        pqt.selectAll(`.pq${counter-1}`).transition()
            .delay(2000*counter)
            .duration(0)
            .attr('font-size','0px');

        setInterval(function(){
            document.querySelector('#edgebtn').disabled=false;
            document.querySelector('#run').disabled=false;
        },2000*counter);
        // document.querySelector('#edgebtn').disabled=false;
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

        coods=[
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

        window.scrollTo(0,0);
        document.querySelector('#edgelist').innerHTML="";
    };

});