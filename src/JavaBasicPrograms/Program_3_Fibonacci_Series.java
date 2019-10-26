
public class Program_3_Fibonacci_Series {
	public static void main(String[] args) {
		
		int fibonacci = 0;
		int n1 = 0;
		int n2 = 1;
		int noffibonaccci = 10;
		int i=0;
		while(i <= noffibonaccci) {
			
			System.out.print( n1 +" +");
			
			fibonacci = n1+n2;
			n1=n2;
			n2=fibonacci;
			i++;
		}
		
		}
	}
//https://www.programiz.com/java-programming/examples/fibonacci-series