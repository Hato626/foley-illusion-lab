(function(root){'use strict';
  function drawScene(canvas,index,side,time,events,blind=false){
    const c=canvas.getContext('2d'),W=600,H=300;canvas.width=W;canvas.height=H;
    const night=side===1,bg=night?'#192f3b':'#f4e3c4',ink=night?'#d9f1ec':'#213c3d',accent=night?'#ffce77':'#d55b3d';
    c.fillStyle=bg;c.fillRect(0,0,W,H);c.strokeStyle=ink;c.fillStyle=ink;c.lineWidth=4;c.lineCap='round';c.lineJoin='round';
    const line=(x,y,a,b)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();};
    const rect=(x,y,w,h,color=ink)=>{c.fillStyle=color;c.fillRect(x,y,w,h);c.fillStyle=ink;};
    const circle=(x,y,r,color=ink)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,Math.PI*2);c.fill();c.fillStyle=ink;};
    const poly=(points,color=ink)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.fillStyle=ink;};
    const text=(s,x,y,size=18)=>{c.font=`${size}px system-ui`;c.fillStyle=ink;c.textAlign='center';c.fillText(s,x,y);};
    if(blind){circle(300,140,40,accent);rect(283,127,12,26,bg);rect(305,116,12,48,bg);text('先听声音，猜一猜它的来源',300,230,20);return;}
    const stamps=events.map(e=>e.time),last=stamps.filter(t=>t<=time).at(-1),dt=last===undefined?9:time-last,p=Math.max(0,1-dt/.45),beat=Math.sin(Math.min(1,dt/.45)*Math.PI)*p;
    const next=stamps.find(t=>t>time),pre=next===undefined?0:Math.max(0,1-(next-time)/.6),wave=Math.sin(time*3);
    c.globalAlpha=.12;for(let x=20;x<600;x+=30)circle(x,280,1);c.globalAlpha=1;
    const sparks=(x,y)=>{for(let k=0;k<7;k++){const a=k*Math.PI*2/7;line(x+Math.cos(a)*30,y+Math.sin(a)*30,x+Math.cos(a)*(30+p*35),y+Math.sin(a)*(30+p*35));}};
    switch(index*2+side){
      case 0: rect(220,55,160,200,accent);rect(230,65,140*(1-pre*.7),180,bg);circle(345-pre*88,155,7);line(200,256,400,256);break;
      case 1:poly([[180,220],[290,195],[420,220],[315,250]],accent);poly([[180,210],[290,184],[420,210],[315,240]],ink);poly([[290,184],[290+110*Math.cos(pre*2.9),184-100*Math.sin(pre*2.9)],[420,210],[315,240]],bg);break;
      case 2:line(110,244,490,244);circle(300,216-Math.sin(pre*Math.PI)*145-beat*50,28,accent);c.globalAlpha=.2;circle(300,244,20+pre*15);c.globalAlpha=1;break;
      case 3:rect(80,230,440,8,accent);if(pre>0)circle(300,65+pre*160,9,accent);c.strokeStyle=accent;c.globalAlpha=p;for(let k=0;k<3;k++){c.beginPath();c.ellipse(300,230,10+(1-p)*70+k*15,3+(1-p)*10,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;break;
      case 4:rect(180,140,240,100,accent);rect(210,65,180,105,bg);line(230,95,350,95);for(let k=0;k<5;k++)rect(205+k*39,184-(k===Math.floor(time*4)%5?p*12:0),24,18);circle(405,140,15);break;
      case 5:for(let k=0;k<11;k++)line((k*60-time*45)%660,250,(k*60-time*45)%660+25,250);rect(185,125,230,90,accent);rect(320,80,65,65,accent);circle(235,220,30);circle(365,220,30);rect(210,143,58,35,bg);rect(285,143,55,35,bg);break;
      case 6:c.save();c.translate(300,145);c.scale(1+p*.18,1+p*.18);c.fillStyle=accent;c.beginPath();c.moveTo(0,60);c.bezierCurveTo(-120,-10,-50,-90,0,-35);c.bezierCurveTo(50,-90,120,-10,0,60);c.fill();c.restore();break;
      case 7:poly([[265,230],[335,230],[320,90],[280,90]],ink);rect(270,75,60,30,accent);c.globalAlpha=.12+p*.6;poly([[300,88],[550,40],[550,150]],accent);c.globalAlpha=1;break;
      case 8:rect(160,40,280,200,accent);rect(174,54,252,172,bg);line(300,54,300,226);line(174,140,426,140);for(let k=0;k<14;k++)line(185+k*17,60+(time*150+k*31)%150,180+k*17,74+(time*150+k*31)%150);break;
      case 9:poly([[220,165],[380,165],[355,245],[245,245]],accent);for(let k=0;k<6;k++){const x=255+k*19;circle(x,155-Math.max(0,p*70-k*8),15,bg);circle(x-7,150-Math.max(0,p*70-k*8),10,bg);}break;
      case 10:for(let j=0;j<2;j++){const x=250+j*100;c.save();c.translate(x,150);c.rotate(time*(j?-1:1)*1.5);for(let k=0;k<12;k++){c.rotate(Math.PI/6);rect(42,-9,17,18,accent);}circle(0,0,45,accent);circle(0,0,17,bg);c.restore();}break;
      case 11:circle(300,155,28,accent);circle(300,116,18,accent);for(let j=-1;j<=1;j+=2){c.save();c.translate(300,155);c.rotate(j*(.6+Math.sin(time*40)*.45));c.beginPath();c.ellipse(j*45,0,45,14,0,0,Math.PI*2);c.stroke();c.restore();line(300,165,300+j*55,215);}break;
      case 12:rect(220,175+beat*5,160,65,accent);rect(230,166+beat*5,140,15);if(pre>0){circle(300,50+pre*110,17,accent);circle(300,50+pre*110,8,bg);}break;
      case 13:for(let k=0;k<7;k++){const x=115+k*60,y=95+(k%2)*70;c.globalAlpha=.15+(k<stamps.filter(t=>t<=time).length? .8:0);poly([[x,y-19],[x+6,y-6],[x+20,y],[x+6,y+6],[x,y+19],[x-6,y+6],[x-20,y],[x-6,y-6]],accent);}c.globalAlpha=1;break;
      case 14:rect(170,45,260,8);for(let j=0;j<2;j++){c.fillStyle=accent;c.beginPath();c.moveTo(175+j*140,55);c.lineTo(275+j*140,55);c.bezierCurveTo(260+j*140+wave*25,120,285+j*140-wave*25,180,270+j*140,240);c.lineTo(175+j*140,240);c.fill();}break;
      case 15:for(let j=0;j<4;j++){c.strokeStyle=j%2?accent:ink;c.beginPath();for(let x=0;x<=600;x+=5){const y=160+j*24+Math.sin(x/75-time*2-j)*22;c.lineTo(x,y);}c.stroke();}break;
      case 16:c.save();c.translate(120+(time*90)%420,130+wave*35);poly([[-60,0],[60,-25],[-13,35],[-5,4]],accent);line(-5,4,60,-25);c.restore();break;
      case 17:c.save();c.translate(120+(time*90)%420,130+wave*35);poly([[-40,5],[30,-5],[50,3],[25,10]],accent);poly([[0,5],[-25,-40-Math.sin(time*12)*20],[20,-4]],accent);c.restore();break;
      case 18:c.strokeStyle=accent;c.lineWidth=24;c.beginPath();c.arc(260,130,55,Math.PI,0);c.stroke();line(205,130,205,180);line(315,130,315,180);rect(260-pre*95,199-pre*10,30,25);break;
      case 19:rect(100,140,90,35,accent);circle(450,150,50);circle(450,150,35,bg);circle(450,150,15,accent);c.globalAlpha=p;rect(190,151,260,8,accent);sparks(450,150);c.globalAlpha=1;break;
      case 20:poly([[150,195],[250,80],[395,90],[460,210]],accent);c.strokeStyle=bg;line(300,95,275+p*16,140);line(275+p*16,140,330,170);line(330,170,310,210);break;
      case 21:line(220,245,380,235);line(230,230,370,250);poly([[250,230],[240+p*20,150],[285,175],[310,70+p*30],[365,180],[345,230]],accent);poly([[280,230],[305,150],[330,230]],bg);break;
      case 22:for(let k=0;k<13;k++){rect(275-(k>time*3?20:0),60+k*14,20,8,accent);rect(303+(k>time*3?20:0),65+k*14,20,8,accent);}rect(285,60+Math.min(time*3,12)*14,30,25);break;
      case 23:rect(160,192,300,55,accent);c.save();c.translate(300+wave*65,150);c.rotate(-.2);poly([[-130,-20],[100,-20],[80,20],[-130,20]],ink);for(let k=0;k<13;k++)poly([[-120+k*15,20],[-113+k*15,30],[-107+k*15,20]],ink);rect(85,-35,50,60,accent);c.restore();break;
      case 24:line(80,210,520,210);line(300,170,300,240);rect(90,130,15,65,accent);rect(495,130,15,65,accent);circle(105+(Math.sin(time*3)+1)*195,150+Math.cos(time*6)*20,9);break;
      case 25:c.strokeStyle=accent;for(let k=1;k<=3;k++){c.beginPath();c.arc(300,150,k*38,0,Math.PI*2);c.stroke();}line(300,150,300+110*Math.cos(time*3),150+110*Math.sin(time*3));circle(370,100,6+p*6,accent);break;
      case 26:circle(300,145,100,accent);circle(300,145,88,bg);for(let k=0;k<12;k++)circle(300+72*Math.sin(k*Math.PI/6),145-72*Math.cos(k*Math.PI/6),3);line(300,145,300+60*Math.sin(Math.floor(time*2)*Math.PI/6),145-60*Math.cos(Math.floor(time*2)*Math.PI/6));line(300,145,265,145);break;
      case 27:line(90,245,510,245);for(let j=0;j<2;j++){const y=202+Math.max(0,Math.sin(time*4+j*Math.PI))*25;rect(200+j*140,y-65,23,65,accent);poly([[195+j*140,y],[230+j*140,y],[265+j*140,y+16],[195+j*140,y+16]],ink);}break;
      case 28:c.globalAlpha=1-p;circle(300,145,55,accent);circle(285,130,10,bg);c.globalAlpha=p;sparks(300,145);c.globalAlpha=1;break;
      case 29:circle(245+pre*30,145,52,accent);circle(355-pre*30,145,30);if(p)sparks(300,145);c.strokeStyle=accent;c.beginPath();c.ellipse(245,145,80,18,-.3,0,Math.PI*2);c.stroke();break;
      case 30:line(100,80,100,250);line(500,80,500,250);c.strokeStyle=accent;c.beginPath();c.moveTo(100,90);c.quadraticCurveTo(300,200+p*25,500,90);c.stroke();for(let k=0;k<11;k++){const x=100+k*40;line(x,100+Math.sin(k/10*Math.PI)*80,x,215+p*8*Math.sin(k));}line(100,215,500,215);break;
      case 31:circle(290,140,60,accent);rect(330,90,70,45,accent);rect(360,75,45,55,accent);poly([[240,135],[170,190],[255,170]],accent);rect(260,180,20,55-p*10,accent);rect(310,180,20,55+p*8,accent);circle(390,90,4);line(120,250,470,250);break;
      case 32:rect(200,45,200,220,accent);circle(300,160,70);circle(300,160,57,bg);c.save();c.translate(300,160);c.rotate(time*3);rect(-33,-25,45,35,accent);rect(5,12,32,30);c.restore();circle(225,69,6,bg);break;
      case 33:for(let k=0;k<26;k++){const x=100+(k*47+Math.sin(time+k)*30)%400,y=30+(k*31+time*35)%220;line(x-4,y,x+4,y);line(x,y-4,x,y+4);}break;
      case 34:c.beginPath();c.ellipse(300,165,125,45,0,0,Math.PI*2);c.fill();rect(285,95,40,50);line(305,95,305,75);line(305,75,340,75);for(let k=0;k<3;k++)circle(240+k*60,160,14,accent);c.strokeStyle=accent;c.globalAlpha=p;c.beginPath();c.arc(410,165,30+(1-p)*100,-1,1);c.stroke();c.globalAlpha=1;break;
      case 35:rect(215,70,170,155,accent);rect(235,100,130,65,bg);rect(250,120,25,Math.max(4,18-p*16));rect(325,120,25,Math.max(4,18-p*16));line(265,190,335,190);line(300,70,300,45);circle(300,40,8);break;
      case 36:rect(210,130,180,100,accent);circle(245,95,45);circle(355,95,45);for(let j=0;j<2;j++)for(let k=0;k<3;k++)circle(245+j*110+Math.cos(time*4+k*2.1)*22,95+Math.sin(time*4+k*2.1)*22,9,bg);poly([[390,155],[460,130],[460,215],[390,195]],ink);break;
      case 37:c.beginPath();c.ellipse(290,145,75,40,0,0,Math.PI*2);c.fill();rect(340,95,25,65);poly([[345,95],[390,80],[380,120],[345,125]],ink);for(let k=0;k<4;k++){const x=240+k*30;line(x,168,x+Math.sin(time*9+k*2)*20,225);}line(210,140,180,180);break;
      case 38:poly([[270,205],[270,95],[300,50],[330,95],[330,205]],accent);circle(300,115,17,bg);poly([[270,170],[245,220],[270,205]],ink);poly([[330,170],[355,220],[330,205]],ink);if(time>4.4)poly([[280,205],[300,280+wave*15],[320,205]],accent);break;
      case 39:circle(300,150,85,accent);circle(300,150,65,bg);text(String(Math.max(0,4-Math.floor(time))).padStart(2,'0'),300,168,48);rect(285,45,30,25);if(time>4.4)sparks(300,150);break;
    }
    if(p>.02){c.globalAlpha=p*.6;c.strokeStyle=accent;c.lineWidth=2;c.strokeRect(5,5,590,290);c.globalAlpha=1;}
  }
  root.FoleyScenes={drawScene};
})(typeof globalThis==='object'?globalThis:this);
