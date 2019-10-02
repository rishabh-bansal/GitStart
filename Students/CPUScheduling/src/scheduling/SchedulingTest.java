package scheduling;

/**
 *
 * @author vietn
 */
public class SchedulingTest {

    public static void main(String[] args) {
        Process p0;
        Process p1;
        Process p2;
        Process p3;
        Process[] rawProcesses;
        int latency;

//        p0 = new Process(37, 3);
//        p1 = new Process(20, 10);
//        p2 = new Process(14, 24);
//        rawProcesses = new Process[]{p0, p1, p2};
//        Scheduling.letdoit(rawProcesses);
        p0 = new Process(7, 0);
        p1 = new Process(4, 2);
        p2 = new Process(1, 4);
        p3 = new Process(5, 5);
        rawProcesses = new Process[]{p0, p1, p2, p3};
        Scheduling.letdoit(rawProcesses);

//        p0 = new Process(21, 0);
//        p1 = new Process(10, 30);
//        p2 = new Process(40, 20);
//        p3 = new Process(25, 40);
//        rawProcesses = new Process[]{p0, p1, p2, p3};
//        Scheduling.letdoit(rawProcesses);
//        p0 = new Process(21);
//        p1 = new Process(10);
//        p2 = new Process(6);
//        rawProcesses = new Process[]{p0, p1, p2};
//        Scheduling.letdoit(rawProcesses);
//        p0 = new Process(24, 0);
//        p1 = new Process(40, 20);
//        p2 = new Process(10, 30);
//        p3 = new Process(15, 50);
//        rawProcesses = new Process[]{p0, p1, p2, p3};
//        Scheduling.letdoit(rawProcesses);
    }
}
