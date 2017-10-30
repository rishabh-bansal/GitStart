# 2 raise to power 15 = 32768 and the sum of its digits is 3 + 2 + 7 + 6 + 8 = 26.

# What is the sum of the digits of the number 2 raise to power 1000?

def power_two (raise_num):
	pow = 1
	while(raise_num > 0):
		pow = pow * 2
		raise_num -= 1
	return pow
	
	
def pow_sum (num):
	sum_of_pow = 0
	power = power_two(num)
	print ("2 raise to power ",num," is ",power)
	while( power > 0):
		rem = power % 10
		sum_of_pow += rem
		power //= 10
	return sum_of_pow
	
raise_num = 15
sum_of_pow = pow_sum(raise_num)
print("Sum of power is ",sum_of_pow)