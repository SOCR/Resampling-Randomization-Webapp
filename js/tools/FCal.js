/***
	
public : socr.tools.fCal.computeP - Computes p-Value <-> f-Value correspondance for a given f-Value
@param var x - the F-Value
@param <int> ndf - Numerator Degree of Freedom
@param <int> ddf - Denominator Degree of Freedom

***/

socr.tools.fCal = (function() {
    return {
      computeP: function(x, ndf, ddf) {
        var fDist, pVal;
        if (x == null) {
          x = 0.1;
        }
        if (ndf == null) {
          ndf = 5;
        }
        if (ddf == null) {
          ddf = 5;
        }
        fDist = new FDistribution(ndf, ddf);
        return pVal = 1 - fDist.CDF(x);
      }
    };
 })();