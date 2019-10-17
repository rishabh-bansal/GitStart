__author__ = 'Shahbaz_Akhtar'
a=int(input("Enter a number : "))
if a > 1:
    for counter in range(2,a):
        if a % counter == 0:
            print("Not a prime number")
            break
    else:
        print("Prime number")
else:
    print("Not a prime number")
