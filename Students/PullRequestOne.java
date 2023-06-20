import java.util.Scanner;

public class PullRequestOne {
    public static void main(String[] args) {
        System.out.println("What's your name:");
        Scanner scan = new Scanner(System.in);
        String inputString = scan.nextLine();

        scan.close();

        System.out.println("Hello:");
        System.out.println(inputString);
    }
}
