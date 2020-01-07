#to multiply two numbers using recursion

def multiply(x, y):
    if y < 0:
        return multiply(x, -y)
    elif y == 0:
        return 0
    elif y == 1:
        return x
    else:
        return x + multiply(x, y - 1)

x = 2
y = -3
result = multiply(x, y)
if(x<0 and y<0):
  result = -result
elif(x<0 or y<0):
  result = -result
  
print(result);