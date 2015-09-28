
/**
 * good source
 * http://wavepot.com/stagas/got-some-303
 * http://wavepot.com/stagas/paranoia
 * http://wavepot.com/nicross/wavepot-engine
 * 
 * data
 * https://github.com/jd-code/groovit/
 * 
 * @name basicSample
 * @version 0.0.766
 * test 
 */
  
//var dd=new Date();
//var i,sec;
//sec=dd.getMilliseconds();

//sampler source test from stagas/sampler
import snare from 'jd-code/groovit/master/SAMPLES/SNAR_13D.WAV';
import hihat from 'pdv/webmpc/master/sounds/r909/909hat.wav';
import guitar from 'zillionk/AirInstruments/master/data/guitarAm.wav';

import Sampler from 'stagas/sampler';
//import comb from 'gpatient/Changecombfilter6';
import Comb from './index.js';
import dbg from 'debug';
dbg('SampleRate555')(sampleRate);

var drums = Sampler(8);

drums.tune(1.1);
drums.add('snare', snare);
drums.add('hihat', hihat);

var lead = Sampler(1);
lead.add('guitar', guitar);



function makeSampler(t)
{
  var out;
  if ( (t*8)    % 1 === 0 ) lead.tune([0.1,[0.2,2][t/4%2|0]][t%2|0]);
  if ( (t/3+2/4) % 1 === 0 ) drums.play('snare', 1, 1);
  if ( (t+2/4)   % 1 === 0 ) drums.play('hihat', 0.8, 1.2);

  if ( (t+1/8*2) % 1 === 0 ) lead.play('guitar', 0.8, 4.5);
  if ( (t/3+2/4) % 1 === 0 ) lead.play('guitar', 0.8, [7,14][(t/8)%2|0]);
  if ( (t/4+3/4) % 1 === 0 ) lead.play('guitar', 0.75, 4.5);

  out=drums.mix()+lead.mix();
  return out;
}


////////////////////////////////wave file buffer reading test from stagas/sampler

function wavToFloat32Array(buffer){
  var view = new DataView(buffer, 44);
  var len = view.byteLength / 2;
  var floats = new Float32Array(len);
  for (var i = 0; i < view.byteLength; i += 2) {
    var s = view.getUint16(i, true);
    if (s > 32767) {
      s -= 65536;
    }
    s /= 32768;
    floats[i/2] = s;
  }
  return floats;
}
 
var bufDataTestNum=0,bufDataTestChk=0;
var bufDataTestArray=wavToFloat32Array(snare);
function bufDataTest(t)
{
  var out=0;
  if(Math.round(t*100)%700===0)
    bufDataTestChk=1;
  if(bufDataTestChk==1){
    out=bufDataTestArray[bufDataTestNum];
    bufDataTestNum++;
    if(bufDataTestNum>=bufDataTestArray.length)
    {bufDataTestNum=0;bufDataTestChk=0;}
  }
  return out;
}

////////////////////////////////////////simple kick ugen algorism  from got-some-303
function arp(t,measure, x, y, z){
  var ts = t / 2 % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
}
///////////////////////////////////////combtest
var comb4 = Comb(34315); 
comb4.feedback = 1.10505115;
comb4.damp = 0.9599; 
comb4.setInputMul(0.150); 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var volFreqs=[1,0.2,3,0.4,5,6,0.7,8,0.9,0.10];
  var freqs=[1100,200,300,400,500,600];
  
var r1,r2,r3;
var arr=new Float32Array(400);//[1,2,3];

  var tau=Math.PI*2;
  
function initcode(t){
  var i;
for(i=0;i<Math.round(t*1000)%300;i++)Math.random();
for(i=0;i<300;i++)arr[i]=Math.random();
//  for(i=0;i<300;i++)arr[i]=500+i*10;
}
function makeVol(t,num)
{
  var i;
  var ret;

  for(i=0;i<10;i++){
    ret=Math.sin(t*tau*volFreqs[i])*arr[i*2+num]
       +Math.cos(t*tau*volFreqs[i])*arr[i*2+num+1];
  }
  return ret*0.2;
}
var check=0;
function makeSnd(t)
{
  var snd;
  var ampA=[1,2,3,4,5,6];
  var ampB=[1,2,3,4,5,6];

  var i;

   snd=0;
  for(i=0;i<6;i++){
    ampA[i]=makeVol(t,0+i*20);
    ampB[i]=makeVol(t,20+i*20);
  }
  for(i=0;i<6;i++)
    snd+=Math.sin(t*tau*freqs[i])*ampA[i]+(Math.cos(t*tau*freqs[i])*ampB[i]);
     
  return snd;
}

/////////////// two way practice of latch //////////////////////////

var latchChk=[0,0],latchVal=[0,0];
function latch(t,measher,val,nn)
{
  
  var ret=0;
  if((Math.round(t*1000)%(measher*10))<100)
  {if(latchChk[nn]===0)latchVal[nn]=val;latchChk[nn]=1;}
  else{latchChk[nn]=0;}
  ret=latchVal[nn];
  return ret;
}

function latch2(measher){
    if (!(this instanceof latch2)) return new latch2(measher);
  
  this.chk=0;
  this.measher=measher;
  this.val=0;
}

latch2.prototype.run=function (t,val){
    var ret=0;
    if((Math.round(t*1000)%(this.measher*10))<100){if(this.chk===0)this.val=val;this.chk=1;}
    else{this.chk=0;}
    ret=this.val;
    return ret;
  };

var lat1= latch2(70);
var lat2=latch2(36);

///////////////////////////////////////////////////////////////////////


function limit(val,cut)
{
  if(val>cut)return cut;
  if(val<-cut)return -cut;

  return val;
}
export function dsp(t) {
   var kick =arp(t,1/4, 48, 50, 8)+arp(t,1/6, 48, 350, 458);
  var snd,out=0;
  var i; 

  if(t<2.0 && check===0){
    initcode(t);check=1;
    for(i=0;i<20;i++)arr[i+20]*=0.5;
    return Math.sin(t*tau*340);}
  else{
  freqs[0]=latch(t,70,makeVol(t*5,125)*440+840,0);
  //freqs[0]=lat1.run(t,makeVol(t*5,125)*440+840);
  freqs[1]=makeVol(t/2,66)*2400+140;
  freqs[2]=latch(t,36,makeVol(t*5,22)*220+420,1);
  //freqs[2]=lat2.run(t,makeVol(t*5,22)*220+420,1);
  kick=kick;
  snd=makeSnd(t)*0.3+kick*0.02;
  snd+=makeSampler(t*2)*0.1;
  snd+=bufDataTest(t)*0.07;
  //out=comb4.run(Math.random()*0.1+kick);
  out=comb4.run(snd); 
  out=limit(out,0.5);
  return out;  
  
    
  } 
  //var num=dd.getSeconds();
  //return Math.sin(t*Math.PI*2*arr[Math.round(num)%300]);
  
}

