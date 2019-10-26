
public class Program_2_Factorial_WhileLoop {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
		int n=0;
		int factorial=1;
		
		if (n==1 || n==0)
		{
			factorial = 1;
		}
		
		while(n>=1)
		{
			factorial=factorial*n;
			n--;
		}
		
		System.out.println(factorial);
	}
}
