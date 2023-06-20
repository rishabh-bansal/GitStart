#include<bits/stdc++.h>
using namespace std;

string str="";
 ifstream inf;
    ofstream outf;

class Edge{
  public:
  int beg;
  int end;
  int weight;
};
Edge edges[100];

int fpar(int v,int *parent){
  if(parent[v]==v)
    return v;
  return fpar(parent[v],parent);
}
bool compare(Edge e1,Edge e2){
  return e1.weight<e2.weight;
}
void krus(Edge*edges,int E,int V){
  sort(edges,edges+E,compare);
  Edge*output=new Edge[V-1];
   int *parent=new int[V];
    int parin=0;
 while(parin<V){
  parent[parin]=parin;
  parin++;
 }
 for(int count=0,i=0; count!=V-1 ; i++){
   Edge curred=edges[i];
    int bg=fpar(edges[i].beg,parent);
    int  en=fpar(edges[i].end,parent);
    if(bg!=en){
      output[count]=curred;
      count++;
      parent[bg]=en;
    }
 }
  int tem=0;
  while(tem<V-1){
    outf<<char(output[tem].beg+97)<<","<<char(output[tem].end+97)<<endl;
    tem++;
  }
 
}

int main(int argc,char **argv)
{
  char *f1=argv[1];
char *f2=argv[2];
    
    inf.open(f1);
    outf.open(f2);

inf>>str;
int V=str[0]-48;
inf>>str;
int e=0;
while(inf)
{
    string str;
    inf>>str;
    edges[e].beg=str[0]-97;
    edges[e].end=str[2]-97;
     int i=4;
    int strng=str[i]-48;
   i++;
   for(  ; str[i]!='\0' ; i++){
    strng=(str[i]-48)+strng*10;
   }
    edges[e].weight=strng;
    e++;
}
 krus(edges,e-1,V);
 inf.close();
 outf.close();
 return 1;

 }