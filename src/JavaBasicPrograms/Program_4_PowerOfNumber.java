
public class Program_4_PowerOfNumber {

	public static void main(String args[]) {
		
		int number=2;
		int power=0;
		int result =1;
		while(power>0)
		{
			result=result*number;
			power--;
		}
		System.out.println(result);
	}
}
