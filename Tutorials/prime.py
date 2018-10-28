import math

def prime(n):
	i=2
	flag=0
	while i<math.sqrt(n):
		if(n%i == 0):
			flag=1
			break
		i=i+1
	if(flag == 0):
		print "Prime"
	else:
		print "Not Prime"

prime(1000000007)
