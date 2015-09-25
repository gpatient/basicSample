
/**
 *  change source form  stagas/Combofilter
 * @module CombFilter6 
 * @author ChangeFromStagas
 * @org MYORGFromOpendsp
 * @desc ChangeFromCombfilter
 * @license MmFromMit
 */

export default CombFilter6;

function CombFilter6(size){
  if (!(this instanceof CombFilter6)) return new CombFilter6(size);
  this.size = size;
  this.index = 0;
  this.buffer = new Float32Array(size);
  this.feedback = 0;
  this.filter = 0;
  this.damp = 0;
  this.k=-1;
  this.sum=0;
  this.average=0;
  this.max=0;
  this.divNum=1;
  
  this.inputMul=0.315;
  this.initInputMul=this.inputMul;
  this.setInputMul(0.315);
  this.len=size;
}

CombFilter6.prototype.setInputMul= function(val){
  this.inputMul=val;
  this.initInputMul=val;
  
};
CombFilter6.prototype.run = function(input){
  //this.buffer[this.index] = input * 0.015 + this.filter * this.feedback;
 
  var output = this.buffer[this.index];
  //if(this.index>0)output = this.buffer[this.index-1];
  this.filter = output * (1 - this.damp) + this.filter * this.damp;
  this.buffer[this.index] =this.k * input * this.inputMul + this.filter * this.feedback;
  this.buffer[this.index] -=this.average;
  this.buffer[this.index] /=this.divNum;
  
  this.sum+=output;
  if(this.max>output)this.max=output;
  if (++this.index === this.size) 
  {
    this.index = 0;this.k*=-1;
    this.average=this.sum/this.size;this.sum=0;
    if(Math.abs(this.max)>1.0)
      this.divNum=Math.abs(this.max);
      else{ 
        this.divNum=1.0/((this.feedback+1.0)/2.0);
        if(Math.random()<0.9){
          //this.size*=0.9;
          this.size=Math.floor(this.size*0.986);
          //this.size=Math.floor(Math.random()*(this.len-100))+100;
          if(this.size<100){
            this.size=Math.floor(Math.random()*(this.len-100))+100;
            this.inputMul=this.initInputMul;
          }
          this.inputMul*=1.3;
          if(this.inputMul>5.0) 
            this.inputMul=this.initInputMul;
        }
        
      }
  this.max=0;
  }
  return output;
};
