
#include <stdio.h> 
int main() 
{ 
 int *i, *j; 
 int *ii = NULL, *jj = NULL; 
 if(i == j) 
 { 
  printf("This might get printed if both i and j are same by chance."); 
 } 
 if(ii == jj) 
 { 
  printf("This is always printed coz ii and jj are same."); 
 } 
 return 0; 
} 
