let socket;

let players;
let host;
let myId;
let serverIp;
let state;
function setup() {
    initBLE();

    
    createCanvas(windowWidth,windowHeight);
    background(220);
    socket = io('http://'+serverIp); //change server ip here
    socket.on('players', (num)=>{  players=num; });
    socket.on('hoster name', (hostInput)=>{  
        host=hostInput;
        if (host==myId) {
            socket.emit('send pattern', myPattern);
        }
    });
    socket.on('answer pattern', (patternIn)=>{
        ansPattern=patternIn;
    });
    let init_myPattern=false;
    let init_ansPattern=false;
    
    socket.on('beat', (stepsIn)=>{
        havePlayed=false;
        playBeat(steps, ansPattern);
        steps=stepsIn;
       
        if (host!=myId) { // now is play mode
            state='play';
            
            myPattern= [
                [0,0,0,0,0,0,0,0], //bd
                [0,0,0,0,0,0,0,0], //cr
                [0,0,0,0,0,0,0,0], //hh
                [0,0,0,0,0,0,0,0], //t1
                [0,0,0,0,0,0,0,0], //t2
            ]
            init_myPattern=false;
            
            
        } else {         // now is host mode
            state='host';
            playBeat(steps, myPattern);
            ansPattern= [ 
                [0,0,0,0,0,0,0,0], //bd
                [0,0,0,0,0,0,0,0], //cr
                [0,0,0,0,0,0,0,0], //hh
                [0,0,0,0,0,0,0,0], //t1
                [0,0,0,0,0,0,0,0], //t2
            ]
            if (!init_myPattern) {
                myPattern= [
                    [0,0,0,0,0,0,0,0], //bd
                    [0,0,0,0,0,0,0,0], //cr
                    [0,0,0,0,0,0,0,0], //hh
                    [0,0,0,0,0,0,0,0], //t1
                    [0,0,0,0,0,0,0,0], //t2
                ]
                init_myPattern=true;
            }
            
            
        }
        //console.log(state);
        
    });
}



let steps;
let havePlayed;
function draw() {
    myId=socket.id;
    
    if (key>0 && key<6 && keyIsPressed && state=='host') {
        myPattern[key-1][steps]=1;
        if (!havePlayed) {
            playBeat(steps, myPattern);
            havePlayed=true;
        }
    }
    if (state=='host') background(255,0,0,10);
    else background(0,128,220);
    let spaceW=windowWidth/9;
    let spaceH=windowHeight/7;
    let shW=spaceW/2;
    let shH=spaceH;

    fill(0);
    textSize(16);
    text('online: '+players, shW, shH/3);
    text('Host  : '+host, shW, shH/2);
    text('state: '+ state, shW, shH/1.5);
    
    
    for (let i=0; i<8; i++) {
        for (let j=0; j<5; j++) {
            if (myPattern[j][i]==1) {
                
                let minW=Math.min(spaceH,spaceW);
                switch(j) {
                    default:
                    break; case 0: 
                    image(img_bdrum, shW+spaceW*i, shH+spaceH*j, minW,minW);
                    break; case 1:case 2:
                    image(img_cymbals, shW+spaceW*i, shH+spaceH*j, minW,minW);
                    break; case 3: case 4:
                    image(img_drum, shW+spaceW*i, shH+spaceH*j, minW,minW);
                }
                
                fill(0,30);
            } else if (ansPattern[j][i]==1) {
                
                fill(150);
                let minW=Math.min(spaceH,spaceW);
                switch(j) {
                    default:
                    break; case 0: 
                    image(img_bdrum, shW+spaceW*i, shH+spaceH*j, minW,minW);
                    break; case 1:case 2:
                    image(img_cymbals, shW+spaceW*i, shH+spaceH*j, minW,minW);
                    break; case 3: case 4:
                    image(img_drum, shW+spaceW*i, shH+spaceH*j, minW,minW);
                }
                
            }
            else {
                fill(255);
            }
            //rect(shW+spaceW*i, shH+spaceH*j, spaceW,spaceH); //draw player
            

        }
        fill(255,255,0,10);
        rect(shW+steps*spaceW,shH,spaceW,spaceH*5);
        stroke(0);
    }
}

