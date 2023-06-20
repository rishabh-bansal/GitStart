//implementation of matrix chain multiplication (dynamic programming)

#include<bits/stdc++.h>
using namespace std;
int m[100][100];
int s[100][100];
int m_cal(vector<int> p)
{
	int n=p.size()-1;
	int min;
	for(int i=1;i<=n;i++)
	{
		m[i][i]=0;
	}
	
	for(int i=1;i<n;i++)
	{
		for(int j=1;j+i<=n;j++)
		{
			min=INT_MAX; 
			for(int k=j;k<j+i;k++)
			{ 
			if(min>m[j][k]+m[k+1][j+i]+p[j-1]*p[k]*p[j+i])
			{ min=m[j][j+i]=m[j][k]+m[k+1][j+i]+p[j-1]*p[k]*p[j+i];
			 s[j][j+i]=k;}

			}
			//cout<<"m("<<j<<","<<j+i<<")="<<m[j][j+i]<<" ";
		}
		//cout<<endl;
	}
	

return m[1][n];
}

void print_mcm(int i,int j)
	{//cout<<"{"<<i<<","<<j<<"}";
	if(i==j)
	 cout<<"A"<<i;
	 else
	 {
	 	cout<<"(";
	 	print_mcm(i,s[i][j]);
	 	print_mcm(s[i][j]+1,j);
	 	cout<<")";
		 }	
	}
		
		
int main()
{
	vector<int> p;
	int x;
	while(1)
	{
	cin>>x;
	if(x<0)
	break;
	p.push_back(x);
	}
	cout<<"no. of multiplications="<<m_cal(p)<<endl;
	print_mcm(1,p.size()-1);
	cout<<endl;

	
	return 0;
}
