
'''Given a non-empty string like "Code" return a string like "CCoCodCode".


string_splosion('Code') → 'CCoCodCode'
string_splosion('abc') → 'aababc'
string_splosion('ab') → 'aab'  '''

def string_splosion(given_string):
  print_str = ''
  counter = 0
  for index in range (0,len(given_string)):
    counter = 0
    while ( counter <= index) :
      print_str += given_string[counter]
      counter += 1
  return print_str

str1 = 'Code'      
print(string_splosion(str1))