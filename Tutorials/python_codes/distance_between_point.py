
 # to calculate the distance between two points using their co-ordinates.

# Expected Output :

# Input coordinates of two points:                                        
# Starting x1: 23.5                                                 
# Ending y1: 67.5                                                  
# Starting x2: 25.3                                                 
# Ending y2: 69.5                                                  
# The distance is 284.73km.


from math import sqrt

def equivalent(x2,x1):
	equi = (x2 - x1) * (x2 - x1)
	return equi

lat1 = 23.5
lat2 = 25.3

long1 = 67.5
long2 = 69.5

eq_lat = equivalent(lat2, lat1) 
eq_long = equivalent(long2, long1)

eq_sum = eq_lat + eq_long

distance = sqrt(eq_sum)
print(distance)

