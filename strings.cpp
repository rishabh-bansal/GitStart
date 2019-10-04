#include<iostream>
#include<cstring>
#include<algorithm>

using namespace std;

bool compare(string a, string b){
    return a.length()>b.length();
}

bool compare2(string a, string b){
    return a>b;
}

int main(){
	// char a[] = {'a', 'b', 'c'};
	// char b[] = {'a', 'b', 'c', '\0'};
	// char c[] = "abc";

	// cout<<"First: "<<a<<endl;
	// cout<<"Second: "<<b<<endl;
	// cout<<"Third: "<<c<<endl;

	// char d[20], e[20];
	// cout<<"Enter string: \n";
	// cin>>d;
	// // cin.getline(e, 20);

	// cout<<endl<<d;

    string s1[] = {"Aka", "Rachi", "Akanksha", "Rachit", "Racheshwar"};

    sort(s1, s1+5, compare);

    for(int i=0; i<5; i++){
        cout<<s1[i]<<",";
    }

    string s("Initialising string using STL");
    cout<<s<<endl;
    for(int i=0; i<s.length(); i++){
        cout<<s[i]<<'-';
    }
}