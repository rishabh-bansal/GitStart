# Given a non-empty string and an int n, return a new string where the char at index n has been removed. The value of n will be a valid index of a char in the original string (i.e. n will be in the range 0..len(str)-1 inclusive).


# missing_char('kitten', 1) → 'ktten'
# missing_char('kitten', 0) → 'itten'
# missing_char('kitten', 4) → 'kittn'


def missing_char(sam_str, n):
	new_str = ""
	for index in range(0,len(sam_str)):
		if(index != n):
			new_str+=sam_str[index];
		print(new_str)


missing_char('kitten', 1)