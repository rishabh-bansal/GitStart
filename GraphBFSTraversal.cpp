#include <iostream>
#include <list>

using namespace std;

class Graph {

	int n; //no. of vertices

	list<int> *adj;

public:

	Graph(int n) {
		this->n=n;
		adj = new list<int>[n];
	}

	void addEdge(int v, int w) { // add w in v's list
		adj[v].push_back(w);
	}

	void BFS(int s) {		// s is a source
		bool *visited = new bool[n];

		for(int i=0; i < n; i++) {
			visited[i] = false;
		}

		list<int> queue;	// for result

		visited[s] = true;
		queue.push_back(s);

		while(!queue.empty()) {

			s = queue.front();
			cout << s << " ";
			queue.pop_front();

			for(auto it : adj[s]) {

				if(visited[it] == false) {
					visited[it] = true;
					queue.push_back(it);	
				}
				
			}


		}
	}

};

int main() {

	Graph g(7);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(2, 3);
    g.addEdge(2, 5);
    g.addEdge(1, 6);
    g.addEdge(3, 4);
 
    cout << "Following is Breadth First Traversal "
         << "(starting from vertex 2) \n";
    g.BFS(0);

	return 0;
}
