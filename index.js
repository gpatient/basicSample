
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
 * @version 0.0.71
 * test
 */
//var dd=new Date();
//var i,sec;
//sec=dd.getMilliseconds();
import snare from 'jd-code/groovit/master/SAMPLES/SNAR_13D.WAV';
import hihat from 'pdv/webmpc/master/sounds/r909/909hat.wav';
import guitar from 'zillionk/AirInstruments/master/data/guitarAm.wav';

import Sampler from 'stagas/sampler';


var drums = Sampler(8);

drums.tune(1.1);
drums.add('snare', snare);
drums.add('hihat', hihat);

var lead = Sampler(1);
lead.add('guitar', guitar);


function makeSampler(t)
{
  var out;
  if ( (t*8)    % 1 === 0 ) lead.tune([0.1,[.2,2][t/4%2|0]][t%2|0]);
  if ( (t/3+2/4) % 1 === 0 ) drums.play('snare', 1, 1);
  if ( (t+2/4)   % 1 === 0 ) drums.play('hihat', 0.8, 1.2);

  if ( (t+1/8*2) % 1 === 0 ) lead.play('guitar', 0.8, 4.5);
  if ( (t/3+2/4) % 1 === 0 ) lead.play('guitar', 0.8, [7,14][(t/8)%2|0]);
  if ( (t/4+3/4) % 1 === 0 ) lead.play('guitar', 0.75, 4.5);

  out=drums.mix()+lead.mix();
  return out;
}

function arp(t,measure, x, y, z){
  var ts = t / 2 % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
}


///////////////////////

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
  if(Math.round(t*1000)%3000==0)
    bufDataTestChk=1;
  if(bufDataTestChk==1){
    out=bufDataTestArray[bufDataTestNum];
    bufDataTestNum++;
    if(bufDataTestNum>bufDataTestArray.length){bufDataTestNum=0;bufDataTestChk=0;}
  }
  return out;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var volFreqs=[1,2,3,4,5,6,7,8,9,10];
  var freqs=[1100,200,300,400,500,600];
  
var r1,r2,r3;
var arr=[1,2,3];

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
    ret=Math.sin(t*tau/volFreqs[i])*arr[i*2+num]
       +Math.cos(t*tau/volFreqs[i])*arr[i*2+num+1];
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


export function dsp(t) {
   var kick =arp(t,1/4, 48, 50, 8)+arp(t,1/6, 48, 350, 458);
  var snd;
  var ampA=[1,2,3,4,5,6];
  var ampB=[1,2,3,4,5,6];

  var i;

  if(t<2.0 && check==0){initcode(t);check=1;return Math.sin(t*tau*340);}
  else{
  freqs[0]=Math.round(t/8)*100+600;
  freqs[1]=Math.round(t/4)*200+1000;
  kick=kick*Math.abs(makeVol(t,55)/2+0.5);
  snd=makeSnd(t)*0.8+kick*0.3;
  snd+=makeSampler(t*2)*0.1;
  snd+=bufDataTest(t)*0.2;
 
  
  //return snd;
  return snd;
  }
  //var num=dd.getSeconds();
  //return Math.sin(t*Math.PI*2*arr[Math.round(num)%300]);
  
}

