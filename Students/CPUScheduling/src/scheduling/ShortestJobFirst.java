package scheduling;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

/**
 *
 * @author vietn
 */
public class ShortestJobFirst implements Algorithm {

    class Sorter implements Comparator<Process> {

        private int currentTime;

        public Sorter(int currentTime) {
            this.currentTime = currentTime;
        }

        @Override
        public int compare(Process p1, Process p2) {
            int time1 = p1.getStartTime();
            int time2 = p2.getStartTime();
            if (time1 > currentTime && time2 > currentTime) {
                return 0;
            }
            if (time1 > currentTime && time2 <= currentTime) {
                return 1;
            }
            if (time1 <= currentTime && time2 > currentTime) {
                return -1;
            }
            return p1.getAmount() - p2.getAmount();
        }
    }

    @Override
    public ArrayList<Process> sort(ArrayList<Process> processes, Process currentProcess, int currentTime) {
        Collections.sort(processes, new Sorter(currentTime));
        return processes;
    }

    @Override
    public int interrupt(ArrayList<Process> processes, Process currentProcess, int currentTime) {
//        Process currentProcess = processes.get(0);
        return currentTime + currentProcess.getAmount();
    }

}
