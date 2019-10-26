import java.util.Scanner;

public class Program_2_Factorial_Recursion {
public static void main(String[] args) {
	
	
	int factorialResult = factorial(5);
	@SuppressWarnings("resource")
	Scanner scanint = new Scanner(System.in);
	System.out.println("Enter Number : ");
	int n = scanint.nextInt();
	System.out.println("factorial of "+n+" is "+factorial(n));
	}
	static int factorial(int n)
{
	if(n<=1){
		return 1;
	}
	else
	{
		return (n*factorial(n-1));
	}
}
}
