#include <iostream>
#include <array>

#define DIMENSIONE 51

int partition(int *arr, int left, int right);
template<typename T,size_t N>
void quickSort(std::array<T, N>& arr);
void _quickSort(int *arr, int left, int right);


int main(){

		std::array<int, DIMENSIONE> arr {};
		srand(time(nullptr));

		for(int i=0 ; i < arr.max_size() ; i++)
			arr[i] = std::rand()%100;


		//for(int i=0 ; i < arr.max_size() ; i++ )
		//	std::cout << arr[i] << " ";


		quickSort(arr);
		std::cout << "\n";

		for(int i=0 ; i < arr.max_size()-1 ; i++ ){
			std::cout<< arr[i] <<" ";

			if( arr[i]>arr[i+1])
				std::cout<< "ERROR \n";


		}


		std::cout << "\nEND";



	return 0;
}

template<typename T,size_t N>
void quickSort(std::array<T, N>& arr){
	_quickSort( arr.begin() , 0 , arr.max_size()-1 );
}

void _quickSort(int *arr, int left, int right){

	if( left<right ){
		int center=partition(arr,left,right);
		_quickSort(arr,left,center-1);
		_quickSort(arr,center+1,right);
	}

	return;
}

int partition(int *arr, int left, int right){

	int center= left-1;
	int valControllo=arr[right];

	for( ; left<right ; left++ ){

		if( arr[left]<= valControllo ){
			center++;
			int riserva=arr[center];
			arr[center]=arr[left];
			arr[left]=riserva;
		}




	}
	int riserva=arr[center+1];
	arr[center+1]=arr[right];
	arr[right]=riserva;

	return center+1;
}
