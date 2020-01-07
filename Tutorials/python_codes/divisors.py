#To find all the divisors of a number and return it in a list

def sum_div(number):
    divisors = [1]
    for i in range(2, number+1):
        if (number % i)==0:
            divisors.append(i)
    return divisors
print(sum_div(8))
print(sum_div(12))