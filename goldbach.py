from math import *
def Goldbach():
	n = eval(input("Please enter an even number: "))
	while n % 2 != 0:
		n = eval(input("Please enter an even number(You entered an odd number: "))
	if n% 2 ==0:
		for i in range(1,int((n/2))+1):
			a = n-i
			b=1
			while b<= max(sqrt(i),sqrt(a)):
				b = b+1
				if a%b ==0 or i%b ==0: break
			if(a%b !=0 or a ==2) and (i%b !=0 or i==2) and i!=1:
				print(i,'and',a,'is the solution')
Goldbach()
