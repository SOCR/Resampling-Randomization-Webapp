socr.tools.fCal = do ->
	## Public Method

	computeP : ( x=0.1, ndf=5, ddf = 5 ) ->
		fDist = new FDistribution ndf,ddf
		pVal = 1 - fDist.CDF x