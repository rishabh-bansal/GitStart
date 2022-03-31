
public class Program_3_Fibonacci_SeriesForLoop {
public static void main(String[] args) {
	int a =0;
	int b =1;
	int fib;
	
	int number=10;
	
	for(int i =0; i<number; i++)
	{
		System.out.print(a + " ");
		fib = a+b;
		a=b;
		b=fib;
				
	}
}
}
