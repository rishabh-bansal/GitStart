'''
DOCSTRING: ALGORITHM - SIEVE OF ERASTOSTHENES
'''

#USER INPUT
USER_INPUT = int(input('Enter a number: '))

#MAIN FUNCTION   
def primes_sieve(limit):
    '''
    DOCSTRING: THIS FUNCTION WILL GIVE ALL THE PRIMES BELOW A NUMBER
    '''

    # Initialize the primality list
    a = [True] * limit                
    a[0] = a[1] = False

    for (i, isprime) in enumerate(a):
        if isprime:
            yield i

            # Mark factors non-prime
            for n in range(i*i, limit, i): 
                a[n] = False

#EXECUTION
for prime in primes_sieve(USER_INPUT):
    print(prime)
