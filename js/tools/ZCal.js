/***
	
public : socr.tools.zCal.computeP - Computes p-Value <-> z-Value correspondance for a given z-Value
@param var z - the Z-Value
@param <int> mu - mean of the normal distribution
@param <int> sigma - Standard deviation of the normal distribution

***/

socr.tools.zCal = (function() {
    return {
      computeP: function(z,mu,sigma) {
        var normalDist
        normalDist = new NormalDistribution(mu,sigma);
        return (1 - normalDist.CDF(z));
      }
    };
 })();