
'''Given a string and a non-negative int n, return a larger string that is n copies of the original string.


string_times('Hi', 2) → 'HiHi'
string_times('Hi', 3) → 'HiHiHi'
string_times('Hi', 1) → 'Hi' '''

def string_times(given_str, times):
  print_str = '' 
  while( times > 0 ):
    print_str += given_str
    times -= 1
  return print_str
  
given_str = "Hi"
times = 3
print(string_times(given_str,times))