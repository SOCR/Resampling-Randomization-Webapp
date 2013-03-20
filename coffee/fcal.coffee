factorial = (n) ->
	if n<1
		1
	else
		n*factorial n-1

beta = (x,y) ->
	(factorial(x-1)*factorial(y-1))/factorial(x+y-1)

# beta function
# x -> critical value
# nf : numerator degree of freedom
# df : denominator degree of freedom

computeP = (x,nf,df) ->
	t1 = 1 / beta(nf/2,df/2)
	t2 = Math.pow (nf*x)/ (nf*x + df), nf/2
	t3 = Math.pow (1 - (nf*x)/(nf*x + df)), df/2
	t1 * t2 * t3 * (1/x) 