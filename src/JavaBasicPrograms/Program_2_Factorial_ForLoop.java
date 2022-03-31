
public class Program_2_Factorial_ForLoop {
public static void main(String[] args) {
	int n=5;
	int factorial=1;
	if (n==0 || n==1)
	{
		factorial=1;
	}
	for(int i=n;i>=1;i--)
	{
		factorial = factorial*i;
		
	}
	System.out.println(factorial);
}
}
