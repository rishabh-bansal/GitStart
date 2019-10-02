package scheduling;

/**
 *
 * @author vietn
 */
public class Scheduling {

    public static String separator() {
        return "----------------------------------------------------------------";
    }

    public static void firstComeFirstServe(Process[] processes) {
        System.out.println(Scheduling.separator());
        System.out.println("First come first serve: \n");
        Algorithm algorithm = new FirstComeFirstServe();
        Scheduling.run(processes, algorithm);
        System.out.println(Scheduling.separator());
    }

    public static void shortestJobFirst(Process[] process) {
        System.out.println(Scheduling.separator());
        System.out.println("Shortest job first");
        Algorithm algorithm = new ShortestJobFirst();
        Scheduling.run(process, algorithm);
        System.out.println(Scheduling.separator());
    }

    public static void shortestRemainingFirst(Process[] process) {
        System.out.println(Scheduling.separator());
        System.out.println("Shortest remaining first");
        Algorithm algorithm = new ShortestRemainingFirst();
        Scheduling.run(process, algorithm);
        System.out.println(Scheduling.separator());
    }

    public static void roundRobin(Process[] processes, int q) {
        System.out.println(Scheduling.separator());
        System.out.println("Round Robin with q = " + q);
        Algorithm algorithm = new RoundRobin(q);
        Scheduling.run(processes, algorithm);
        System.out.println(Scheduling.separator());
    }

    public static void run(Process[] processes, Algorithm algorithm) {
        int latency = Scheduling.getLatency(processes);
        CPUManagement cpuManagement = new CPUManagement(processes, algorithm, latency);

        //main interite
        cpuManagement.execute();

        //print result
        System.out.println(cpuManagement.toString());
        System.out.println(cpuManagement.getTime());

        Statistic statistic = new Statistic(cpuManagement);
        System.out.println(statistic.toString());
    }

    public static Process[] cloneProcess(Process[] processes) {
        Process[] result = new Process[processes.length];
        for (int i = 0; i < processes.length; i++) {
            result[i] = new Process(processes[i]);
        }
        return result;
    }

    public static int getLatency(Process[] rawProcesses) {
        int latency = Integer.MAX_VALUE;
        for (int i = 0; i < rawProcesses.length; i++) {
            int startTime = rawProcesses[i].getStartTime();
            if (latency > startTime) {
                latency = startTime;
            }
        }
        return latency;
    }

    public static void letdoit(Process[] rawProcesses) {
        Process[] processes;

        processes = Scheduling.cloneProcess(rawProcesses);
        Scheduling.firstComeFirstServe(processes);

        processes = Scheduling.cloneProcess(rawProcesses);
        Scheduling.shortestJobFirst(processes);

        processes = Scheduling.cloneProcess(rawProcesses);
        Scheduling.shortestRemainingFirst(processes);

        processes = Scheduling.cloneProcess(rawProcesses);
        Scheduling.roundRobin(processes, 3);
    }

    public static void main(String[] args) {

        /*
        You are here
         */
//        Process p0 = new Process(37, 0);
//        Process p1 = new Process(20, 7);
//        Process p2 = new Process(14, 21);

//        Process p0 = new Process(37, 3);
//        Process p1 = new Process(20, 10);
//        Process p2 = new Process(14, 24);
        
        Process p0 = new Process(11);
        Process p1 = new Process(7);
        Process p2 = new Process(9);
        Process p3 = new Process(6);
//        Process[] rawProcesses = new Process[]{p0, p1, p2};
        Process[] rawProcesses = new Process[]{p0, p1, p2, p3};
        Scheduling.letdoit(rawProcesses);

    }
}
