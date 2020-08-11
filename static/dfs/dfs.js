// alert('dfs!');
var matrix = [...Array(20)].map(e => Array(20).fill(0));
var nodes = new Array(20);
nodes.fill(0);

function runnodes()
{
    for(var i=0;i<20;i++)
    {
        if(nodes[i])
            console.log(i+1);
    }
}
document.addEventListener('DOMContentLoaded',function(){
    var box=document.querySelector('#dfs');
    box.style.color='white';
    box.style.backgroundColor = '#383F51';

    document.querySelector('#edgeform').onsubmit = function(){
        const start=document.querySelector('#start').value;
        const end=document.querySelector('#end').value;
        document.querySelector("#edgeerror").innerHTML="";
        document.querySelector("#starterror").innerHTML="";
        document.querySelector("#enderror").innerHTML="";

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

        if(matrix[start-1][end-1])
        {
            document.querySelector("#edgeerror").innerHTML="You cannot add the same edge twice.";
            return false;
        }

        matrix[start-1][end-1]=1;
        nodes[start-1]=1;
        nodes[end-1]=1;
        const li = document.createElement('li');
        li.innerHTML=start+" "+end;

        document.querySelector("#edgelist").append(li);
        
        return false;
    };

    document.querySelector('#run').onclick=function(){
        runnodes();
    };
});