#include <bits/stdc++.h>
using namespace std;

struct Process
{
   int pid,burstTime;
};

void bubbleSort(Process arr[], int n)
{
   int i, j;
   for (i = 0; i < n-1; i++)
       for (j = 0; j < n-i-1; j++)
           if (arr[j].burstTime > arr[j+1].burstTime)
              swap(arr[j], arr[j+1]);
}

bool comparison(Process a, Process b)
{
     return (a.burstTime < b.burstTime);
}

void findWaitingTime(Process p[], int n, int waitingTime[])
{
    waitingTime[0] = 0;

    for (int i = 1; i < n ; i++ )
        waitingTime[i] = p[i-1].burstTime + waitingTime[i-1] ;
}

void findTurnAroundTime(Process p[], int n, int waitingTime[], int turnAroundTime[])
{
    for (int i = 0; i < n ; i++)
        turnAroundTime[i] = p[i].burstTime + waitingTime[i];
}

void findavgTime(Process p[], int n)
{
    int waitingTime[n], turnAroundTime[n], avgWaitingTime = 0, avgTurnAroundTime = 0;

    findWaitingTime(p, n, waitingTime);

    findTurnAroundTime(p, n, waitingTime, turnAroundTime);

    cout << "\nProcesses "<< " Burst time " << " Waiting time " << " Turn around time\n";
    for (int i = 0; i < n; i++)
    {
        avgWaitingTime = avgWaitingTime + waitingTime[i];
        avgTurnAroundTime = avgTurnAroundTime + turnAroundTime[i];
        cout << " " << p[i].pid << "\t\t" << p[i].burstTime << "\t " << waitingTime[i] << "\t\t " << turnAroundTime[i] << endl;
    }

    cout << "Average waiting time is = " << (float)avgWaitingTime / (float)n;
    cout << "\nAverage turn around time is = " << (float)avgTurnAroundTime / (float)n;
}

int main()
{
    int n;
    cout<<"\nEnter No. of Processes = ";
    cin>>n;
    Process *proc= new Process[n];
	for(int i=0; i < n; i++)
	{
        cout<<"\nEnter the Burst Time for Process No. "<< i+1<<"=";
        cin>>proc[i].burstTime;
        proc[i].pid=i+1;
    }
    bubbleSort(proc,n);
    cout << "Order in which process gets executed is \n";
    for (int i = 0 ; i < n; i++)
        cout << proc[i].pid <<" ";

    findavgTime(proc, n);
    return 0;
}

