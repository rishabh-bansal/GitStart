#This finds the next smallest palindrome of a specified number


def next_palindrome(num):
	#reverse of number
	
	for counter in range(num):
		rev = reverse(num)
		
		if(num == rev):
			return num
		num += 1

def reverse(num1):
	rev = 0
	while(num1>0):
		rem = num1 % 10
		rev = (rev * 10) + rem
		num1 = num1 // 10
	return rev
	
print(next_palindrome(89))