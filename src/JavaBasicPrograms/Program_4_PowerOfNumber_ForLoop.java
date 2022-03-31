
public class Program_4_PowerOfNumber_ForLoop {

	public static void main (String args[]){
		
		int base=2;
		int power=5;
		int result=1;
		
		for (int i =power; i>0;i--) {
			result = result*base;
		}
		System.out.println(result);
	}
}
