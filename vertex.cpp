#include<iostream>
#include <fstream>
using namespace std;
int chartoint(string str)
{
    int len = str.length();
  int num=0,i=0;
  if(str[0]=='-')
  {
    i++;
  while(i<len)
  {
    num=(num*10)+str[i]-'0';
    i++;
  }
  return -num;
  }
  else
  {
      while(i<len)
  {
    num=(num*10)+str[i]-'0';
    i++;
  }
  return num;

  }
}
int main(int argc,char **argv)
{
ifstream filein(argv[1]);
ofstream fileout(argv[2]);
// string str;
// getline(filein,str);
string str,temp;
getline(filein,str);
int l=str.length();
int i=0;
while(i<l)
{
    while(str[i]!=','&&i<l)
    {
        temp+=str[i];
        i++;
    }
     break;
}
    i++;
    int n=chartoint(temp);
    // char dir=str[i];

// while(filein)
// {
//     string b;
//     filein>>b;
//     c=c+b;
// }
// int n=c.size();
// int V=c[0]-48;
// char start=c[3];
// int index=3+(2*V)-1;
int graph[n][n];
for(int i=0;i<n;i++)
{
for(int j=0;j<n;j++)
{
    graph[i][j]=0;
}
}

getline(filein,str);
 while(!filein.eof())
 {
    getline(filein,str);
     int index1=str[0]-97;
     int index=str[2]-97;
     graph[index1][index]=1;
     graph[index][index1]=1;
 }
for(int i=0;i<n;i++)
{
    int count=0;
    for(int j=0;j<n;j++)
    {
        if(graph[i][j]==1){
            count++;
        }
    }
    char x=97+i;
   fileout<<x<<" "<<count<<endl;
}
}