package scheduling;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

/**
 *
 * @author vietn
 */
public class RoundRobin implements Algorithm {

    private int amountProcess;
    private final int q;

    public RoundRobin(int q) {
        this.amountProcess = 0;
        this.q = q;
    }

    class Sorter implements Comparator<Process> {

        private int currentTime;

        public Sorter(int currentTime) {
            this.currentTime = currentTime;
        }

        @Override
        public int compare(Process p1, Process p2) {
            int amount1 = p1.getAmount();
            int amount2 = p2.getAmount();
            int time1 = p1.getStartTime();
            int time2 = p2.getStartTime();
//            if(amount1 == 0 && amount2 ==0)
            if (time1 > currentTime && time2 > currentTime) {
                return 0;
            }
            if (time1 > currentTime && time2 <= currentTime) {
                return 1;
            }
            if (time1 <= currentTime && time2 > currentTime) {
                return -1;
            }
            return 0;
        }
    }

    @Override
    public ArrayList<Process> sort(ArrayList<Process> processes, Process currentProcess, int currentTime) {
        if (currentTime == 0) {
            this.amountProcess = processes.size();
            return processes;
        }
//        String string = "";
//        for (int i = 0; i < processes.size(); i++) {
//            string += processes.get(i).getStartTime() + " ";
//        }
//        System.out.println(currentTime + " " + string);
        //when kill process, not to re-sort queue
//        if (this.amountProcess == processes.size()) {
//            Process executedProcess = processes.remove(0);
//            processes.add(executedProcess);
//        }
//        string = "";
//        for (int i = 0; i < processes.size(); i++) {
//            string += processes.get(i).getStartTime() + " ";
//        }
//        System.out.println(currentTime + " " + string);
        
        Collections.sort(processes, new Sorter(currentTime));
        
//        string = "";
//        for (int i = 0; i < processes.size(); i++) {
//            string += processes.get(i).getStartTime() + " ";
//        }
//        System.out.println(currentTime + " " + string);
        this.amountProcess = processes.size();
        return processes;
    }

    @Override
    public int interrupt(ArrayList<Process> processes, Process currentProcess, int currentTime) {
//        Process currentProcess = processes.get(0);
        if (currentProcess.getAmount() < this.q) {
            return currentTime + currentProcess.getAmount();
        }
        return currentTime + this.q;
    }

}
